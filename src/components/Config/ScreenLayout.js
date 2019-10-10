'use strict';
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Spinner from "../Spinner";

function Screen({onChange, ...properties}){
  const modes = properties.modes.map((mode)=>{
    return (<option key={mode.name} value={mode.name}>{mode.name}</option>)
  })
  const mode_active_name = properties.mode ? properties.mode : "0";
  function handleChange(e){
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;
    const new_properties = Object.assign({}, properties, {[name]: value});
    onChange(new_properties);
  }
  return (<form className="border-top border-bottom border-light w-100">
    <div className="form-row px-2 mx-0">

      <div className="form-group col-6 col-lg-3">
        <label className="text-primary font-weight-bold">{properties.name}</label>
        <select value={mode_active_name} title="mode" name="mode" onChange={handleChange} className="custom-select">
          <option key="0" value="0">auto</option>
          <option key="off" value="off">off</option>
          {modes}
        </select>
      </div>

      <div className="form-group col-6 col-lg-3">
        <label>Position</label>
        <div className="input-group">
          <label className="form-control input-group-text flex-grow-0 pr-4" htmlFor="posX">X</label>
          <input pattern="\d*" id="posX" onChange={handleChange} value={properties.x} type="text" name="x" className="form-control"/>
          <label className="form-control input-group-text flex-grow-0 pr-4" htmlFor="posY">Y</label>
          <input pattern="\d*" id="posY" onChange={handleChange} value={properties.y} type="text" name="y" className="form-control"/>
        </div>
      </div>

      <div className="form-group col-12 col-lg-6">
        <label className="inptu-group-text">Orientation</label>
        <div className="input-group">
          <select onChange={handleChange} value={properties.rotate} name="rotate" className="custom-select">
            <option key="normal" value="normal">(rotation) normal</option>
            <option key="left" value="left">rotate left</option>
            <option key="right" value="right">rotate right</option>
            <option key="inverted" value="inverted">inverted</option>
          </select>
          <select onChange={handleChange} value={properties.reflect} name="reflect" className="custom-select">
            <option key="normal" value="normal">(reflection) normal</option>
            <option key="x" value="x">mirror x</option>
            <option key="y" value="y">mirror y</option>
            <option key="xy" value="inverted">transpose (xy)</option>
          </select>
        </div>
      </div>
      
    </div>
  </form>)
}

Screen.propTypes = {
  name: PropTypes.string.isRequired,
  connected: PropTypes.bool,
  reflect: PropTypes.string,
  rotate: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  mode: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  modes: PropTypes.arrayOf(PropTypes.shape({
    name:PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    rate: PropTypes.number
  })),
  onChange: PropTypes.func
}

let cancelControl;
function cancellableSaveScreens(screens){
  if(cancelControl) cancelControl.abort();
  cancelControl = new AbortController();
  fetch("/system/screens", {
    method: "PUT", headers:{"Accept":"application/json", "Content-Type":"application/json"}, 
    signal: cancelControl.signal,
    body: JSON.stringify({screens}),
  })
  .then(res => {
    if(!res.ok){
      console.warn("Failed to save screens : ", res.statusText);
    }
  })
}

export default function ScreenLayout(props){
  const [screens, setScreens] = useState();
  useEffect(()=>{
    const abortControl = new AbortController();
    fetch("/system/screens", {headers:{"Accept":"application/json"}, signal: abortControl.signal})
    .then(async res => {
      const body = await res.json()
      if(!res.ok){
        return console.error("Failed to fetch screen configuration : ", body);
      }
      const data = body.screens.map((screen)=>{
        let mode = screen.modes.find(mode => mode.current && ! mode.default);
        if(mode) mode = mode.name
        else mode = "0";
        return Object.assign({}, screen, {
          mode,
        })
      })
      console.log("screen data : ", data);
      setScreens(data);
    })
    return ()=>abortControl.abort();
  }, []);

  if(!screens){
    return (<Spinner/>);
  }
  if(!Array.isArray(screens)) return (<div>No screens</div>)
  function handleChange(data){
    const new_layout = [];
    if(!screens) return;
    for(let screen of screens){
      if(screen.name == data.name){
        new_layout.push(data);
      }else{
        new_layout.push(Object.assign({}, screen));
      }
    }
    setScreens(new_layout);
    console.info("Screen new layout : ", new_layout);
    cancellableSaveScreens(new_layout);
  }

  const screenForms = screens.map(screen=> {return (<Screen key={screen.name} onChange={handleChange} {...screen}/>)});

  return (<React.Fragment>{screenForms}</React.Fragment>);
}

ScreenLayout.propTypes = {
}
'use strict';
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Spinner from "../Spinner";

function Screen(props){
  const modes = props.modes.map((mode)=>{
    return (<option key={mode.name} value={mode.name}>{mode.name}</option>)
  })

  function onChange(e){
    const form = e.currentTarget;
    let d = {};
    for (let e of form.elements){
      d[e.name] = e.value;
    }
    props.onChange(d);
  }
  return (<form onChange={onChange}>
    <label>{props.name}</label>
    <select defaultValue="auto" title="mode" name="mode">
      <option key="auto" value="auto">auto</option>
      <option key="off" value="off">off</option>
      {modes}
    </select>
    <select defaultValue={props.rotate} name="rotate">
      <option key="normal" value="normal">normal</option>
      <option key="left" value="left">left</option>
      <option key="right" value="right">right</option>
      <option key="inverted" value="inverted">inverted</option>
    </select>
    <select defaultValue={props.reflect} name="reflect">
      <option key="normal" value="normal">normal</option>
      <option key="x" value="x">x</option>
      <option key="y" value="y">y</option>
      <option key="xy" value="inverted">xy</option>
    </select>
    <label htmlFor="posX">X : </label>
    <input id="posX" defaultValue={props.x} type="number" name="x"/>
    <label htmlFor="posY">Y : </label>
    <input id="posY" defaultValue={props.y} type="number" name="y"/>
  </form>)
}
Screen.propTypes = {
  name: PropTypes.string.isRequired,
  connected: PropTypes.bool,
  reflect: PropTypes.string,
  rotate: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
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

export default function ScreenLayout({conf, onCommit, ...props}){
  const [displayData, setDisplayData] = useState();

  useEffect(()=>{
    fetch("/system/screens", {headers:{"Accept":"application/json"}})
    .then(async res => {
      const body = await res.json()
      if(!res.ok){
        return console.error("Failed to fetch screen configuration : ", body);
      }
      setDisplayData(body);
    })
  }, [conf]);

  if(!displayData){
    return (<Spinner/>);
  }
  function handleChange(data){
    const screenName = this.name //This refers to the screen emitting a change event
  }
  const screenForms = displayData.screens.map(screen=> {return (<Screen key={screen.name} onChange={handleChange} {...screen}/>)});

  return (<div>{screenForms}</div>);
}

ScreenLayout.propTypes = {
  conf: PropTypes.object,
  onCommit: PropTypes.func
}
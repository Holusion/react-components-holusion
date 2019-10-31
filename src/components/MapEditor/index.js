'use strict';

import React, {useState} from 'react'
import PropTypes from 'prop-types'

import Button from "../Button"
import Icon from "../Icon"


import IconSave from "../../icons/save.svg";

function MapLine(props){
  const editable = typeof props.handleChange === "function"; 
  return (
    <form className="map-editor-line form-group">
      <div className="input-group">
        <div className="input-group-prepend">
          <input name={`keyfor-${props.name}`} type="text" size="8" className="line-name form-control" id="confName" placeholder="identifiant" value={props.name} readOnly />
        </div>
        <input name={props.name} type="text" size="10" className="line-value form-control" id="confValue" placeholder="valeur" value={props.value} onChange={props.handleChange} readOnly={!editable}/>
        <div className="input-group-append">
          <Button className="btn btn-outline-secondary py-0" onClick={(e)=>props.handleRemove(props.name)}><Icon name="remove" width="24px" height="24px"/></Button>
        </div>
      </div>
    </form>
  )
}
MapLine.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleChange: PropTypes.func
}

function AddMapLine(props){
  const [active, setActive] = useState(false);

  if(!active){
    return (<div style={{display:"flex",justifyContent:"flex-end", width:"100%"}}>
      <Button className="btn btn-outline-secondary" onClick={e=>setActive(true)} style={{flexGrow:1}}><Icon name="menu"></Icon>Add</Button>
      </div>)
  }

  const confName = React.createRef();
  const confValue = React.createRef();

  return (<form className="map-editor-line new-line" onSubmit={e=> {e.preventDefault(); props.handleAdd(confName.current.value, confValue.current.value)}}>
    <div className="input-group">
      <div className="input-group-prepend">
        <input type="text" className="line-name form-control" id="confName" placeholder="identifiant" ref={confName}/>
      </div>
      <input type="text" className="line-value form-control" id="confValue" placeholder="valeur" ref={confValue}/>
      <div className="input-group-append">
      <Button type="submit" className="btn btn-outline-secondary"><Icon name="play" /></Button>
      </div>
    </div>
  </form>)
}


export default function MapEditor(props){
  const [items, setItems] = useState(props.items);
  const children = [];

  const has_changes = items.size != props.items.size || JSON.stringify([...items]) != JSON.stringify([...props.items]);


  function saveChanges(new_items){
    setItems(new_items) //optimistic update
    props.onChange(new_items); //props.items should eventually change to make has_changes clean again
  }
  
  for (const [key, value] of items){
    children.push(<MapLine 
      key={key} 
      name={key} 
      value={value}
      handleRemove={(name)=>{
        const newItems = items.filter(([keyName])=> keyName != name);
        setItems(newItems);
        props.onChange(clone);
      }}
      handleChange={props.editable? (e)=>{
        const key = e.target.name;
        const value = e.target.value;
        const clone = new Map(items);
        clone.set(key, value);
        setItems(clone);
        props.onChange(clone)
      } : undefined}
    />)
  }

  return (
    <div className="w-100">
      <div className="w-100 d-flex justify-content-between align-items-center">
        <h3>Configuration</h3>
        <button onClick={()=>props.onChange(items)} className={`btn btn-outline-${has_changes?"warning":"success"}`} title={has_changes?"changementss en attente":"sauvegardé"}>
          {has_changes? <span className="spinner-border spinner-border-sm" role="status"/> : <IconSave/>}
        </button>
      </div>
      {children}
      <AddMapLine key={(items.size|| items.length) +1} handleAdd={(name, value)=> {
        const newItems = new Map(items);
        newItems.set(name, value);
        setItems(newItems);
        props.onChange(newItems);
      }}/>
    </div>
  )
}

MapEditor.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array,PropTypes.instanceOf(Map)]).isRequired,
  editable: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

MapEditor.defaultProps =  {
  editable: false,
}
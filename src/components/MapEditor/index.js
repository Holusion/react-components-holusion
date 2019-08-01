'use strict';

import React, {useState} from 'react'
import PropTypes from 'prop-types'

import Button from "../Button"
import Icon from "../Icon"

import './MapEditor.css';

function MapLine(props){
  return (
    <form className="map-editor-line">
      <input type="text" size="8" className="line-name" id="confName" placeholder="identifiant" value={props.name} readOnly={true} />
      <input type="text" size="10" className="line-value" id="confValue" placeholder="valeur" value={props.value} readOnly={true}/>
      <Button onClick={(e)=>props.handleRemove(props.name)}><Icon name="remove" /></Button>
    </form>
  )
}
MapLine.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  handleRemove: PropTypes.func.isRequired
}

function AddMapLine(props){
  const [active, setActive] = useState(false);

  if(!active){
    return (<div style={{display:"flex",justifyContent:"flex-end", width:"100%"}}>
      <Button onClick={e=>setActive(true)} style={{flexGrow:1}}><Icon name="menu"></Icon>Add</Button>
      </div>)
  }

  const confName = React.createRef();
  const confValue = React.createRef();

  return (<form className="map-editor-line new-line" onSubmit={e=> props.handleAdd(confName.current.value, confValue.current.value)}>
    <input type="text" className="line-name" id="confName" placeholder="identifiant" ref={confName}/>
    <input type="text" className="line-value" id="confValue" placeholder="valeur" ref={confValue}/>
    <Button type="submit"><Icon name="play" /></Button>
  </form>)
}


export default function MapEditor(props){
  const [items, setItems] = useState(props.items);
  const children = [];

  for (const [key, value] of items){
    children.push(<MapLine key={key} name={key} value={value} handleRemove={(name)=>{
      const newItems = items.filter(([keyName])=> keyName != name);
      setItems(newItems);
      props.onChange(newItems);
    }}/>)
  }

  return (
    <div className="map-editor-container">
      {children}
      <AddMapLine handleAdd={(name, value)=> {
        const newItems = Array.from(items);
        newItems.push([name, value]);
        console.log("Set shortcuts to :", newItems);
        setItems(newItems);
        props.onChange(newItems);
      }}/>
    </div>
  )
}
MapEditor.propTypes = {
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

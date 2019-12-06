'use strict';

import React, {useState} from 'react'
import PropTypes from 'prop-types'

import Button from "../Button"
import Icon from "../Icon"


import IconSave from "../../icons/save.svg";
import IconAdd from "../../icons/note_add.svg";


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
          <Button className="btn btn-outline-secondary py-0" onClick={(e)=>{e.preventDefault();props.handleRemove(props.name)}}><Icon name="remove" width="24px" height="24px"/></Button>
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

  const confName = React.createRef();
  const confValue = React.createRef();

  return (<form className="map-editor-line new-line" onSubmit={e=> {e.preventDefault(); props.handleAdd(confName.current.value, confValue.current.value)}}>
    <div className="input-group">
      <div className="input-group-prepend">
        <input type="text" size="8" className="line-name form-control" id="confName" placeholder="identifiant" required ref={confName}/>
      </div>
      <input type="text" size="10" className="line-value form-control" id="confValue" placeholder="valeur" required ref={confValue}/>
      <div className="input-group-append">
      <Button type="submit" className="btn btn-outline-secondary"><IconAdd/></Button>
      </div>
    </div>
  </form>)
}


export default function MapEditor(props){
  const savedItems = new Map(props.items); // will make props.items a map if not already done
  const [localItems, setItems] = useState(savedItems);
  const [isLoading, setLoading] = useState(false);
  const hasChanges = savedItems.size != localItems.size || JSON.stringify([...savedItems]) != JSON.stringify([...localItems]);
  //console.info("Has changes : ", hasChanges, "sizes:", savedItems.size, localItems.size, "strings : \n",JSON.stringify([...savedItems]),"\n", JSON.stringify([...localItems]));
  const children = [];

  for (const [key, value] of localItems){
    children.push(<MapLine 
      key={key} 
      name={key} 
      value={value}
      handleRemove={(name)=>{
        const newItems = new Map(localItems);
        newItems.delete(name);
        if(newItems.size !== localItems.size){
          console.error("Failed to remove :", name);
        }
        setItems(newItems)
      }}
      handleChange={props.editable? (e)=>{
        const key = e.target.name;
        const value = e.target.value;
        const newItems = new Map(localItems);
        newItems.set(key, value);
        setItems(newItems);
      } : undefined}
    />)
  }

  function saveChanges(){
    setLoading(true);
    const res = props.onChange(Array.from(localItems));
    Promise.resolve(res)
    .then(()=>{
      setLoading(false);
    })
  }
  
  return (
    <div className="w-100">
      <div className="w-100 d-flex justify-content-between align-items-center">
        {props.title && (<h3>{props.title}</h3>)}
        <button onClick={saveChanges} className={`btn text-${hasChanges?"warning":"success"}`} title={hasChanges?"changementss en attente":"sauvegardé"}>
          {isLoading? <span className="spinner-border spinner-border-sm" role="status"/> : <IconSave/>}
        </button>
      </div>
      {children}
      <AddMapLine key={localItems.size +1} handleAdd={(name, value)=> {
        const newItems = new Map(localItems);
        newItems.set(name, value);
        setItems(newItems);
      }}/>
    </div>
  )
}

MapEditor.propTypes = {
  items: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),PropTypes.instanceOf(Map)]).isRequired,
  editable: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
}

MapEditor.defaultProps =  {
  editable: false,
}
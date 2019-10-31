'use strict';
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Spinner from "../Spinner";

import {useFetch} from "../../hooks/useFetch";

import IconSave from "../../icons/save.svg";


export default function Mimeapps(props){
  const [localContent, setLocalContent] = useState(null);
  const [isLoading, setLoading] = useState(false);
  //const [content, setContent] = useFetch({path : "/system/mimeapps", type:"text"});
  function handleChange(e){
    const value = e.target.value;
    setLocalContent(e.target.value);
  }
  function handleSave(e){
    e.preventDefault();
    //console.info("saving data : ", localContent);
    setLoading(true);
    fetch("/config/mimeapps", { method: "PUT", headers: {"Content-Type": "text/plain"}, body: localContent})
    .then(r=>{
      if(r.ok){
        console.info("changes saved");
      }else{
        r.text().then((msg)=>{
          props.addToast(msg, {title:"warn"});
        })
      }
    }, (e)=>{
      props.addToast("Fail to save mime associations : "+e.message, {title:"warn"});
    })
    .then(()=> setLoading(false));
  }

  const hasChanges = localContent && localContent !== props.value;
  hasChanges && console.info("Has changes : ", localContent, props.value);
  return (<form className='w-100'>
    <div className="d-flex align-content-between w-100">
      <label className="flex-grow-1">Associations "mime"</label> 
      <button disabled={isLoading} className={`btn btn-outline-muted${hasChanges?" text-danger": " text-success"}`} onClick={handleSave}>
        {isLoading ?  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <IconSave/>}
        </button>
    </div>
    <div className="form-group">
      <textarea className="form-control" onChange={handleChange} value={localContent? localContent:props.value} rows="6"/>
    </div>
  </form>
    
  )
}

Mimeapps.propTypes = {
  addToast: PropTypes.func,
  value: PropTypes.object,
}

Mimeapps.defaultProps = {
  addToast: console.error,
  value: {},
}
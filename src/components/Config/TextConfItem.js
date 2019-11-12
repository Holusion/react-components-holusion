'use strict';
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Spinner from "../Spinner";

import { toast } from 'react-toastify';

import IconSave from "../../icons/save.svg";


export default function TextConfItem({route, ...props}){
  const [localContent, setLocalContent] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isInvalid, setInvalid] = useState(false);
  function handleChange(e){
    setInvalid(false);
    setLocalContent(e.target.value);
  }
  function handleSave(e){
    e.preventDefault();

    setLoading(true);
    fetch(route, { method: "PUT", headers: {"Content-Type": "text/plain"}, body: localContent})
    .then(r=>{
      if(!r.ok){
        r.text().then((msg)=>{
          toast.warn(msg);
          setInvalid(true);
        })
      }else{
        setInvalid(false);
        setLocalContent(null);
      }
    }, (e)=>{
      toast.warn("Fail to save mime associations : "+e.message);
    })
    .then(()=> setLoading(false));
  }

  const hasChanges = localContent !== null && localContent !== props.value; //can use strict equal because they are strings
  return (<form className='w-100'>
    <div className="d-flex align-content-between w-100">
      <label className="flex-grow-1">{props.title}</label> 
      <button disabled={isLoading} className={`btn ${hasChanges?" text-warning": " text-success"}`} onClick={handleSave}>
        {isLoading ?  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <IconSave/>}
        </button>
    </div>
    <div className="form-group">
      <textarea className={`form-control${isInvalid?" is-invalid":""}`} onChange={handleChange} value={hasChanges ? localContent:props.value} rows={props.rows} placeholder={props.placeholder}/>
    </div>
  </form>
    
  )
}

TextConfItem.propTypes = {
  route: PropTypes.string.isRequired,
  value: PropTypes.string,
  title: PropTypes.string,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
}

TextConfItem.defaultProps = {
  value: {},
  rows: 2,
}
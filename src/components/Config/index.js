'use strict';
import React from 'react'
import PropTypes from 'prop-types'

import Spinner from "../Spinner";
import Radio from '../Radio';
import MapEditor from '../MapEditor';

import ScreenLayout from "./ScreenLayout";
import Mimeapps from "./Mimeapps";
import {useSocket, useSocketState} from '../../hooks/useSocket';

export default function Config(props){
  const items = useSocket("update", props.items);
  const opts =  items.reduce((res, {key, value}) =>{
    res[key] = value;
    return res;
  }, {});
  async function handleChange(key, value){
    console.log("Setting conf key :", key, "to : ", value, "(", typeof value, ")");
    const r = await fetch(`/config/${key}`, {
      method: "PUT",
      body: JSON.stringify({value}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const body = await r.json();
    if(!r.ok){
      return props.addToast(`Failed to save config (${body.code}) : ${body.message}`, {title: "error"});
    }
  }
  
  return (
    <div className="product-configuration" >
      <div className="row no-gutters">
        <div className="col">
          <label>Play content in loop or stop after each item?</label>
          <div className="form-group">
            <Radio items={[{label:"loop", value:true}, {label:"don't loop", value: false}]} checked={opts.loop} onChange={val=>handleChange("loop", val == 'true')}/> 
          </div>
        </div>
      </div>
      <div className="row no-gutters">
        <div className="col">
          <label>Raccourcis clavier</label>
          <MapEditor items={opts.shortcuts} onChange={handleChange.bind(null,"shortcuts")}/>
          </div>
      </div>
      <div className="row no-gutters pt-4">
        <div className="col">
          <label>Ecrans</label>
          <ScreenLayout conf={opts.screens} />
        </div>
      </div>
      <div className="row no-gutters pt-4">
        <Mimeapps value={opts.mimeapps} addToast={props.addToast} />
      </div>
    </div>
  )
}

Config.propTypes = {
  items: PropTypes.array,
  addToast: PropTypes.func,
}

Config.defaultProps = {
  addToast: console.error
}
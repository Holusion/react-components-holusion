'use strict';
import React from 'react'
import PropTypes from 'prop-types'

import Radio from '../Radio';
import MapEditor from '../MapEditor';

export default function Config(props){
  const opts = props.items.reduce((res, {key, value}) =>{
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
      //FIXME : proper reporting
      return console.error("Failed to save config : ", r.status, body);
    }
  }

  return (
    <div className="product-configuration" >
      <label>Play content in loop or stop after each item?</label>
      <Radio className="row" items={[{label:"loop", value:true}, {label:"don't loop", value: false}]} checked={opts.loop} onChange={val=>handleChange("loop", val == 'true')}/> 
      <label>Raccourcis clavier</label>
      <MapEditor items={opts.shortcuts} onChange={handleChange.bind(null,"shortcuts")}/>
    </div>
  )
}

Config.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
}

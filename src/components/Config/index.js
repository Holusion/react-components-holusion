'use strict';
import React from 'react'
import PropTypes from 'prop-types'

import Spinner from "../Spinner";
import Radio from '../Radio';
import MapEditor from '../MapEditor';

import ScreenLayout from "./ScreenLayout";
import { toast } from 'react-toastify';

//import Mimeapps from "./Mimeapps";
import TextConfItem from "./TextConfItem";
import {useSocket, useSocketState} from '../../hooks/useSocket';

import PoweroffIcon from "../../icons/baseline-power_off-24px.svg";


export default function Config(props){
  const items = useSocket("update", props.items);
  const connected = useSocketState();

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
      return toast.error(`Failed to save config (${body.code}) : ${body.message}`);
    }
  }
 console.log("Configuration values : ", opts.mimeapps, opts.screens); 
  return (
    <div className="product-configuration" >
      <div className="row no-gutters">
        <div className="d-flex justify-content-between w-100">
          <h2>Configuration</h2>
          {!connected && (
            <button disabled className={`btn text-muted`}>
              <Spinner active style={{margin: 0}} size={34} title="Connection lost...">
                <PoweroffIcon  style={{opacity:0.4, padding:"0px"}}/>
              </Spinner>
            </button>
          )}
          
        </div>
      </div>
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
        <TextConfItem title="Ecrans" route="/config/screens"  value={opts.screens} rows={1} placeholder="xrandr command line"/>
      </div>
      <div className="row no-gutters pt-4">
          <TextConfItem title={`Associations "mime"`} route="/config/mimeapps" value={opts.mimeapps} rows={6} placeholder="Added Associations"/>
      </div>
    </div>
  )
}

Config.propTypes = {
  items: PropTypes.array,
}

Config.defaultProps = {
}
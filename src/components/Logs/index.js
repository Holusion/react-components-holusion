'use strict';
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { toast } from 'react-toastify';
import Spinner from "../Spinner";
import PoweroffIcon from "../../icons/baseline-power_off-24px.svg";

//import Mimeapps from "./Mimeapps";
import {useConnect, useSocketState} from '../../hooks/useSocket';

function Line(props){
  let color = "text-dark";
  switch(props.severity){
    case "warning":
      color="text-warning";
      break;
    case "err":
    case "crit":
    case "alert":
    case "emerg":
      color="text-danger"
      break;
  }
  return (<div>
    <span className="text-muted">{props["@timestamp"].toLocaleString()} </span>
    <span className={color}>[{props.severity}]</span>
    <span>{props.message}</span>
    </div>)
}
Line.propTypes =  {
  message: PropTypes.string.isRequired,
  "@timestamp": PropTypes.instanceOf(Date).isRequired,
  "@version": PropTypes.oneOf([1]),
  severity: PropTypes.oneOf(["emerg", "alert", "crit", "err", "warning", "notice", "info", "debug"]),
}


function reviveLine(key, value){
  switch(key){
    case "@timestamp":
      return new Date(value);
    case "@version":
      return parseInt(value);
    default:
      return value;
  }
}

export default function Logs(props){
  const socket = useConnect();
  const connected = useSocketState();
  const [lines, setLines] = useState([]);
  useEffect(()=>{
    if(!socket) return;
    function onNewLine(line){
      let d;
      try{
        d = JSON.parse(line, reviveLine)
      }catch(e){
        console.warn("Failed to parse %s : ", line, e);
        d = {"@timestamp":new Date(), severity:"alert", "@version": 1, message:`PARSE FAILED! ${line}`};
      }
      setLines(lines=> [...lines, d]);
    }
    function onError(e){
      toast.error(`Failed to get logs : ${e.message}`);
    }
    socket.on("line", onNewLine);
    socket.on("error", onError)
    return ()=>{
      socket.removeListener("line", onNewLine);
      socket.removeListener("error", onError);
    }
  }, [socket]);

  return (<div id="log-lines">
    <div className="d-flex justify-content-between w-100">
      <h2>System logs</h2>
      {!connected && (
        <button disabled className={`btn text-muted`}>
          <Spinner active style={{margin: 0}} size={34} title="Connection lost...">
            <PoweroffIcon  style={{opacity:0.4, padding:"0px"}}/>
          </Spinner>
        </button>
      )}
      
    </div>
    <div className="d-flex flex-column-reverse">
      {lines.map((l, i) => (<Line {...l} key={i}/>))}
    </div>
  </div>)
  ;
}

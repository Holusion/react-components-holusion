'use strict';

import React, {useEffect} from "react";
import PropTypes from "prop-types"

import useToaster from "../../hooks/useToaster";
import InfoIcon from "../../icons/info.svg"
import "./toast.scss"


function Toast(props){
  let header_class = "toast-header";
  let icon = <InfoIcon style={{fill:"currentColor"}}/>
  switch (props.title) {
    case "warn":
      header_class += " text-warning";
      break;
    case "error":
      header_class += " text-danger";
      break;
    case "info":
    default:
      header_class += " text-muted";
      break;
  }
  return (<div  className={`toast show`} role="alert" aria-live="assertive" aria-atomic="true">
    <div className={header_class}>
      <span className="pr-2">
        {icon}
      </span>
      <strong className="mr-auto">{props.title}</strong>
      <small className="text-muted">{props.time}</small>
      <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onClick={props.remove}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="toast-body">
      {props.content}
    </div>
  </div>)
}
Toast.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
}

export default function ToastManager(props){
  const [addToast, toasts] = useToaster();
  return <div  className="toast-container" >
    <div aria-live="polite" aria-atomic="true" className="toast-content">
      {toasts.map(toast => (<Toast key={toast.id} {...toast}/>))}
    </div>
  </div>
}
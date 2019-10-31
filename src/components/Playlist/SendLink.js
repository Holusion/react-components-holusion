import React, {useState, createRef} from "react";
import PropTypes from "prop-types";


import CheckIcon from "../../icons/check.svg";

export default function SendLink({uri, ...props}){
  const [state, setState] = useState({value:"", status: "ready"});
  const ref = createRef();
  function handleClick(e){
      setState({value: state.value, status: "loading"});
      fetch(url.resolve(uri,"/medias"), {method:"POST",headers:{"Content-Type":"application/json"}, body: JSON.stringify({uri:state.value})}).then(async r =>{
          const newData = await r.json();
          //console.log("set state : ", newData, "for component", props.component.name);
          if(!r.ok){
              console.log("Error :",r.message, "for SendLink");
              setState({value: state.value, status: "error"});
          }else{
              setState({value: "", status: "ready"});
          }
      }, (e)=>{
          console.log("caught error", e, " for SendLink");
          setState({value: state.value, status: "error"});
      })
  };
  function handleChange(e){
      setState({value:e.target.value, status: "ready"})
  }
  let icn;
  switch(state.status){
      case "ready":
          icn = (<CheckIcon/>);
          break;
      case "loading":
          icn = (<RefreshIcon/>);
          break;
      case "error":
      default:
          icn = (<RefreshIcon/>);
          break;
  }

  return (<span {...props}>
      <a onClick={handleClick} style={{color:"green"}} title="send link">{icn}</a>
      <input  type="text" placeholder="https://example.com" value={state.value} onChange={handleChange}/>
  </span>)
}

SendLink.propTypes = {
  uri: PropTypes.string.isRequired
}
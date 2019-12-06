import FormData from 'form-data';
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import Spinner from "../Spinner";
import Card from "../Card";

import ErrorIcon from "../../icons/info.svg";

export default function Uploader(props){
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(-1);
  useEffect(()=>{
    console.log("Upload File :", props.file);
    const form = new FormData();
    form.append("file", props.file);
    let xhr = new XMLHttpRequest();
    xhr.onload = function onUploadDone(){
      if(xhr.status != 200){
        setError({code:xhr.status, message: xhr.statusText});
      }else{
        setProgress("done");
        setTimeout(props.onDone, 0);
      }
    }

    xhr.upload.onprogress = function onUploadProgress(evt){
      if(evt.lengthComputable){
        console.log("Progress : ", Math.floor(evt.loaded/evt.total*100));
        setProgress(Math.floor(evt.loaded/evt.total*100));
      }else{
        setProgress("unknown");
      }
    }
    xhr.onerror = function onUploadError(){
      setError({code: xhr.status, message: xhr.statusText});
    }

    xhr.open('POST', props.url);
    xhr.send(form);

    return ()=>{
      xhr.abort();
    }
  }, []);

  if(progress == "done"){
    return null;
  }else if (!error){
    let text = (progress < 0)? "":  `${progress}%`;
    let title = (<div className="playlist-item-bottom"><div className="playlist-item-title"><span>{props.file.name}</span></div></div>)
    return (
      <Card title={title} top={(<div style={{color:"white", padding:"4px", fontWeight:"bold"}}>Upload</div>)}>
        <div style={{margin:"auto", color:"var(--theme-secondary", flexGrow:1}}><Spinner  size={80} active>{text}</Spinner></div>
      </Card>
      )
  }else{
    return (<Card top="Upload error" title={error.message}>
      <div style={{display:"flex",flexDirection:"column", justifyContent:"stretch"}}>
        <ErrorIcon/>
        failed to upload, encountered error : 
      </div>
    </Card>)
  }
}

Uploader.propTypes = {
  onDone: PropTypes.func
}
Uploader.defaultProps = {
  onDone: function(){},
}
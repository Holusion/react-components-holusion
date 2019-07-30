import FormData from 'form-data';
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import Spinner from "../Spinner";
import Card from "../Card";

export default function Uploader(props){
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(()=>{
    const form = new FormData();
    form.append('file', props.file);
    fetch(props.url, {method:"POST", body:form}).then(async r =>{
      const newData = await r.json();
      if(!r.ok){
        setError(newData);
      }else{
        setData(newData);
      }
      setLoading(false);
    });
  }, []);
  let content;
  if(isLoading){
    return (
      <Card>
        <div style={{margin:"auto", color:"var(--theme-secondary"}}><Spinner active/></div>
      </Card>
      )
  }else if(error){
    return (<Card>
      <h2>There was an error</h2>
      <div>Trying to upload, encountered error : </div>
      <div>{error.message.errorType}</div>
    </Card>)
  }else{
    return null;
  }
}

Uploader.propTypes = {
  onDone: PropTypes.func
}
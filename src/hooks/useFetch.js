import {useEffect, useState} from 'react';

export function useFetch({path, initial, type="json"}) {
  const [data, setData] = useState(initial);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    console.warn("useFetch("+path+")");
    const abortControl = new AbortController();
    const headers = (type =="json") ? {"Accept": "application/json"}: {};
    fetch(path, {headers, signal: abortControl.signal})
    .then(async res => {
      const body = await (type == "json"? res.json() : res.text());
      if(!res.ok){
        return console.error("Failed to fetch "+path+" : ", body);
      }
      setData(body);
    })
    return ()=>abortControl.abort();
  }, [path, type, dirty]);

  return [data, setData, function refresh(){setDirty(dirty+1)}];
}
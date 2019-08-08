'use strict'
import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React, { useState, useEffect, createRef, useCallback } from 'react'
import {useSocket, useSocketState} from '../../hooks/useSocket';
import url from 'url'

import {useDropzone} from 'react-dropzone';
import Uploader from "../Upload/Uploader";
import UploadManager from "../Upload";
import Spinner from "../Spinner";
import Fab from "../Fab";


import LinkIcon from "../../icons/baseline-link-24px.svg";
import UploadIcon from "../../icons/upload.svg";
import CheckIcon from "../../icons/check.svg";
import CloseIcon from "../../icons/close.svg";
import RefreshIcon from "../../icons/refresh.svg";
import PoweroffIcon from "../../icons/baseline-power_off-24px.svg";

function play(props, item) {
    props.onTaskStart(`play-${item.name}`)
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${props.url}`, `/control/current/${item.name}`), options).then(res => {    
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            props.onTaskEnd(`play-${item.name}`, err);
        } else {
            props.onTaskEnd(`play-${item.name}`);
        }
    }).catch(err => {
        props.onTaskEnd(`play-${item.name}`, err)
    })
}

function remove(props, item) {
    props.onTaskStart(`remove-${item.name}`);
    let options = {
        method: 'DELETE',
        body: null,
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${props.url}`, `/medias/${encodeURIComponent(item.name)}`), options).then(res => {    
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            props.onTaskEnd(`remove-${item.name}`, err);    
        } else {
            item.visible = false;
            props.onTaskEnd(`remove-${item.name}`);            
        }
    }).catch(err => {
        props.onTaskEnd(`remove-${item.name}`, err);   
    })
}

function setActive(props, item) {
    props.onTaskStart(`active-${item.name}`);
    let options = {
        method: 'PUT',
        body: JSON.stringify(Object.assign(item,{active:!item.active})),
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${props.url}`, `/playlist`), options).then(res => {
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            props.onTaskEnd(`active-${item.name}`, err);            
        } else {
            props.onTaskEnd(`active-${item.name}`);
        }
    }).catch(err => {
        props.onTaskEnd(`active-${item.name}`, err);
    })
}

function select(item, selected, setSelected) {
    setSelected([...selected, item])
}

function unselectItem(item, selected, setSelected) {
    setSelected(selected.filter(elem => elem.name !== item.name))
}

function selectOneItem(item, setSelected) {
    setSelected([item]);
}



function handleClick(props, item, selected, setSelected, event) {
    if(event.target.className === "card") {
        if(selected.filter(elem => item.name === elem.name).length > 0) {
            play(props, item);
        }
        selectOneItem(item, setSelected);
    }
}

function handleCheckboxChange(item, selected, setSelected) {
    const isSelected = selected.filter(elem => item.name === elem.name).length > 0;
    isSelected ? unselectItem(item, selected, setSelected) : select(item, selected, setSelected);
}



function SendLink({uri, ...props}){
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

export default function Playlist(props) {
    // Default to connected in the beginning because we don't know socket's state
    //And it's probably true...
    const [selected, setSelected] = useState([]);
    const [uploads, setUploads] = useState([]);

    const connected = useSocketState();

    const playlist = useSocket("update", []);
    const current = useSocket("current", {});
    
    const {acceptedFiles, getRootProps, getInputProps, isDragActive, open} = useDropzone({
        noKeyboard: true,
        multiple: true
    });
    let new_uploads = acceptedFiles.filter((f)=>{
        return ! uploads.find((u)=> u["name"] = f["name"] && u["lastModified"] == f["lastModified"])
    }).map((file)=>{
        return {
            item: (<Uploader file={file} url={url.resolve(`http://${props.url}`, "/medias")} key={file.path}/>),
            lastModified: file.lastModified,
            name: file.name,
            path: file.path
        };
    })
    if(new_uploads.length != 0){
        console.log("adding a new Upload");
        setUploads([].concat(uploads, new_uploads));
    }


    let cards = playlist.filter((elem) => props.filterBy(elem)).map(item => {
        let imgUrl = encodeURI(url.resolve(`http://${props.url}`, `/medias/${item.name}?thumb=true`).trim());
        return <PlaylistItem 
            key={item.name} 
            item={item} 
            image={imgUrl}
            current={current.name == item.name}
            visible = {item.visible != null ? false : true}
            selected={selected.filter(elem => item.name === elem.name).length > 0}
            onPlay={() => play(props, item)}
            onClick={(event) => handleClick(props, item, selected, setSelected, event)}
            onCheckboxChange={() => handleCheckboxChange(item, selected, setSelected)}
            onRemove={() => remove(props, item)}
            onSwitchChange={() => setActive(props, item)}
        />
    })
    if(cards.length == 0 && uploads.length == 0){
        cards= (<div>
            <h3 className="color-primary">No medias on device</h3>
            <p>Drag &amp; drop a compatible file or click the upload button to begin using your device</p>
            <p>The upload button is the blue box with this icon <UploadIcon/> in the top right corner of your screen</p>
        </div>)
    }
    let content;
    if(!connected && cards.length == 0){
        content = (<Spinner active />)
    }else{
        content = (<div className="playlist-content">
            {cards}
            {uploads.map(u => u.item)}
        </div>)
    }
    let classes = "playlist-container"
    if(isDragActive) classes += ` drag`;
    if(!connected) classes += ` disconnected`;
    return (
        
        <div {...getRootProps({ className:classes, onClick:(e)=>{e.target.classList.contains("fab-container") || e.stopPropagation()}})}>
            <input {...getInputProps()} />
            {content}
            <div className="playlist-drawer">
                <a onClick={(e)=>open(e)} title="Upload a new media"><UploadIcon/></a>
                <span className="folded-drawer-item" >
                    <a className="fold d-folded" onClick={(e)=>e.currentTarget.parentNode.classList.add("active")} title="Add a new link"><LinkIcon/></a>
                    <a className="fold d-unfolded" onClick={(e)=>e.currentTarget.parentNode.classList.remove("active")} title="fold"><CloseIcon/></a>
                    <SendLink className="fold d-unfolded" style={{position:"absolute", top: 0, left: "-300px"}} uri={`http://${props.url}`}/>                    
                </span>
                <Spinner active={!connected} style={{color:"var(--theme-primary)", margin: 0}} size={34} title="Connection lost...">
                    <PoweroffIcon  style={{opacity:0.4, padding:"5px"}}/>
                    </Spinner>
            </div>
        </div>
    )
}

Playlist.propTypes = {
    url: PropTypes.string.isRequired,
    filterBy: PropTypes.func,
    onTaskStart: PropTypes.func,
    onTaskEnd: PropTypes.func,
    onSelectionChange: PropTypes.func,
}

Playlist.defaultProps = {
    onTaskStart: () => {},
    onTaskEnd: () => {},
    onSelectionChange: () => {},
    filterBy: () => true,
}
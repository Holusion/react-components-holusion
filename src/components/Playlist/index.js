'use strict'
import "./Playlist.scss"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React, { useState, useEffect, createRef, useCallback } from 'react'
import {useSocket, useSocketState} from '../../hooks/useSocket';

import url from 'url'


import {useDropzone} from 'react-dropzone';
import Uploader from "../Upload/Uploader";
import Spinner from "../Spinner";
import Fab from "../Fab";

import SendLink from "./SendLink";

import LinkIcon from "../../icons/baseline-link-24px.svg";
import UploadIcon from "../../icons/upload.svg";
import CloseIcon from "../../icons/close.svg";
import RefreshIcon from "../../icons/refresh.svg";
import PoweroffIcon from "../../icons/baseline-power_off-24px.svg";

function play(props, item) {
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${props.url}`, `/control/current/${item.name}`), options).then(res => {    
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            props.addToast(`failed to play ${item.name} : ${err.message}`, {title: "error"});
        }
    }).catch(err => {
        props.addToast(`failed to play ${item.name} : ${err.message}`, {title: "error"});
    })
}

function remove(props, item) {
    //props.addToast(`removed ${item.name}`, {title: "info"});
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

        } else {
            item.visible = false;         
        }
    }).catch(err => {
        props.addToast(`failed to remove ${item.name} : ${err.message}`, {title: "error"});
    })
}

function setActive(props, item) {
    let options = {
        method: 'PUT',
        body: JSON.stringify(Object.assign(item,{active:!item.active})),
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${props.url}`, `/playlist/${item.name}`), options).then(res => {
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            props.addToast(`failed to activate ${item.name} : ${err.message}`, {title: "error"});      
        }
    }).catch(err => {
        props.addToast(`failed to activate ${item.name} : ${err.message}`, {title: "error"});
    })
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
    const isSelected = selected.findIndex(elem => item.name === elem.name) != -1;
    setSelected(isSelected ? selected.filter(elem => elem.name !== item.name) : [...selected, item]);
}



export default function Playlist(props) {
    // Default to connected in the beginning because we don't know socket's state
    //And it's probably true...
    const [selected, setSelected] = useState([]);
    const [uploads, setUploads] = useState([]);

    const connected = useSocketState();
    const playlist = useSocket("change", props.items);
    const current = useSocket("current", {});
    const onDrop = useCallback(acceptedFiles=>{
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
    })

    const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
        onDrop,
        noKeyboard: true,
        multiple: true
    });
   

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
    let classes = "playlist-container";
    if(isDragActive) classes += ` drag`;
    console.log("drag : ", isDragActive);
    if(!connected) classes += ` disconnected`;
    
    const onDragStart = useCallback((e)=>{
        e.dataTransfer.effectAllowed = "copyMove";
        e.preventDefault();
    })
    return (
        
        <div {...getRootProps({ className:classes, onDragStart:onDragStart, onDragOver:e=>e.preventDefault(), onClick:(e)=>{e.target.classList.contains("fab-container") || e.stopPropagation()}})}>
            <input {...getInputProps()} />
            <div className="playlist-content-wrap">
                {content}
            </div>
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
    onSelectionChange: PropTypes.func,
    addToast: PropTypes.func,
}

Playlist.defaultProps = {
    onSelectionChange: () => {},
    filterBy: () => true,
    addToast: console.error,
}
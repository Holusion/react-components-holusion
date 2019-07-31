'use strict'
import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import {useSocket} from '../../hooks/useSocket';
import url from 'url'

import {useDropzone} from 'react-dropzone'
import Card from "../Card";
import Icon from "../Icon";
import Uploader from "../Upload/Uploader";
import Fab from "../Fab";
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
    fetch(url.resolve(`http://${props.url}`, `/medias/${item.name}`), options).then(res => {    
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

function updateCurrent(props, setCurrent) {
    fetch(url.resolve(`http://${props.url}`, "/control/current")).then(res => {
        if(res && res.status == 200) {
            res.json().then(current => setCurrent(current))
        }
    })
}

function updatePlaylist(props, setPlaylist, setCurrent) {
    fetch(url.resolve(`http://${props.url}`, `/playlist`)).then(res => {
        if(res && res.ok) {
            res.json().then(playlist => {
                setPlaylist(playlist);
                updateCurrent(props, setCurrent);
            })   
        } else if(res.status == 204) {
            setPlaylist([]);
        } else {
            throw new Error(`${res.status} - ${res.statusText}`);
        }
    })
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






export default function Playlist(props) {
    const [selected, setSelected] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [current, setCurrent] = useState({});
    const [isDrag, setDrag] = useState(false);
    useEffect(() => updatePlaylist(props, setPlaylist, setCurrent), [props.url]);
    useEffect(() => props.onSelectionChange(selected), [selected]);
    
    useSocket('current', () => updateCurrent(props, setCurrent));
    useSocket('insert', () => updatePlaylist(props, setPlaylist, setCurrent));
    useSocket('remove', () => setTimeout(() => {
        updatePlaylist(props, setPlaylist, setCurrent);
    }, 1000));
    useSocket('update', () => updatePlaylist(props, setPlaylist, setCurrent));

    const {acceptedFiles, getRootProps, getInputProps, isDragActive, open} = useDropzone({
        noKeyboard: true
    });
    const uploads = acceptedFiles.map((file, index)=>{
        return (<Uploader file={file} url={url.resolve(`http://${props.url}`, "/medias")} key={file.path}/>);
    })
    let cards = playlist.map(item => {
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
            onSwitchChange={() => setActive(props, item, setPlaylist, setCurrent)}
        />
    })
    if(cards.length == 0){
        cards= (<div>
            <h3 className="color-primary">No medias on device</h3>
            <p>Drag &amp; drop a compatible file or click the upload button to begin using your device</p>
            <p>The upload button is the blue box with this icon <Icon name="upload"/> in the bottom right corner of your screen</p>
        </div>)
    }
    return (
        <div {...getRootProps({ className:`playlist-container${isDragActive?" drag":""}`, onClick:(e)=>{e.target.classList.contains("fab-container") || e.stopPropagation()}})}>
            <input {...getInputProps()} />
            {cards}
            {uploads}
            <Fab title="Ajouter un media" icon="upload" onClick={(e)=>open(e)}/>
        </div>
    )
}

Playlist.propTypes = {
    url: PropTypes.string.isRequired,
    onTaskStart: PropTypes.func,
    onTaskEnd: PropTypes.func,
    onSelectionChange: PropTypes.func,
}

Playlist.defaultProps = {
    onTaskStart: () => {},
    onTaskEnd: () => {},
    onSelectionChange: () => {},
}
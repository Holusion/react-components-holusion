'use strict'
import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import {useSocket} from '../../hooks/useSocket';
import url from 'url'

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

function remove(props, item, setPlaylist, setCurrent) {
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
            updatePlaylist(props, setPlaylist, setCurrent)
            props.onTaskEnd(`remove-${item.name}`);            
        }
    }).catch(err => {
        props.onTaskEnd(`remove-${item.name}`, err);   
    })
}

function setActive(props, item, setPlaylist, setCurrent) {
    props.onTaskStart(`active-${item.name}`);
    let options = {
        method: 'PUT',
        body: JSON.stringify(Object.assign(item,{active:!item.active})),
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${props.url}`, `/playlist`), options).then(res => {
        updatePlaylist(props, setPlaylist, setCurrent)
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
    
    useEffect(() => updatePlaylist(props, setPlaylist, setCurrent), [props.url]);
    
    useSocket('current', () => updateCurrent(props, setCurrent));
    useSocket('insert', () => updatePlaylist(props, setPlaylist, setCurrent));
    
    const cards = playlist.map(item => {
        let imgUrl = encodeURI(url.resolve(`http://${props.url}`, `/medias/${item.name}?thumb=true`).trim());
        return <PlaylistItem 
            key={item.name} 
            item={item} 
            image={imgUrl}
            current={current.name == item.name}
            selected={selected.filter(elem => item.name === elem.name).length > 0}
            onPlay={() => play(props, item)}
            onClick={(event) => handleClick(props, item, selected, setSelected, event)}
            onCheckboxChange={() => handleCheckboxChange(item, selected, setSelected)}
            onRemove={() => remove(props, item, setPlaylist, setCurrent)}
            onSwitchChange={() => setActive(props, item, setPlaylist, setCurrent)}
        />
    })

    return (
        <div className="playlist-container">
            {cards}
        </div>
    )
}

Playlist.propTypes = {
    url: PropTypes.string.isRequired,
    onTaskStart: PropTypes.func,
    onTaskEnd: PropTypes.func,
}

Playlist.defaultProps = {
    onTaskStart: () => {},
    onTaskEnd: () => {},
}
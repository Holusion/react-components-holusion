'use strict'
import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import {useSocket} from '../../hooks/useSocket';
import url from 'url'

function play(playlistUrl, item) {
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${playlistUrl}`, `/control/current/${item.name}`), options).then(res => {    
        if(!res.ok) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }
    })
}

function remove(playlistUrl, item, setPlaylist, setCurrent) {
    let options = {
        method: 'DELETE',
        body: null,
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${playlistUrl}`, `/medias/${item.name}`), options).then(res => {    
        if(!res.ok) {
            throw new Error(`${res.status} - ${res.statusText}`);
        } else {
            updatePlaylist(playlistUrl, setPlaylist, setCurrent)
        }
    })
}

function setActive(playlistUrl, item, setPlaylist, setCurrent) {
    let options = {
        method: 'PUT',
        body: JSON.stringify(Object.assign(item,{active:!item.active})),
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${playlistUrl}`, `/playlist`), options).then(res => {
        updatePlaylist(playlistUrl, setPlaylist, setCurrent)
        if(!res.ok) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }
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

function updateCurrent(playlistUrl, setCurrent) {
    fetch(url.resolve(`http://${playlistUrl}`, "/control/current")).then(res => {
        if(res && res.status == 200) {
            res.json().then(current => setCurrent(current))
        }
    })
}

function updatePlaylist(playlistUrl, setPlaylist, setCurrent) {
    fetch(url.resolve(`http://${playlistUrl}`, `/playlist`)).then(res => {
        if(res && res.ok) {
            res.json().then(playlist => {
                setPlaylist(playlist);
                updateCurrent(playlistUrl, setCurrent);
            })   
        } else if(res.status == 204) {
            setPlaylist([]);
        } else {
            throw new Error(`${res.status} - ${res.statusText}`);
        }
    })
}

function handleClick(playlistUrl, item, selected, setSelected, event) {
    if(event.target.className === "card") {
        if(selected.filter(elem => item.name === elem.name).length > 0) {
            play(playlistUrl, item);
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
    
    useEffect(() => updatePlaylist(props.url, setPlaylist, setCurrent), [props.url, playlist]);
    useEffect(() => updateCurrent(props.url, setCurrent), current);
    
    useSocket('current-playlist', () => updateCurrent(props.url, setCurrent));
    
    const cards = playlist.map(item => {
        let imgUrl = encodeURI(url.resolve(`http://${props.url}`, `/medias/${item.name}?thumb=true`).trim());
        return <PlaylistItem 
            key={item.name} 
            item={item} 
            image={imgUrl}
            current={current.name == item.name}
            selected={selected.filter(elem => item.name === elem.name).length > 0}
            onPlay={() => play(props.url, item)}
            onClick={(event) => handleClick(props.url, item, selected, setSelected, event)}
            onCheckboxChange={() => handleCheckboxChange(item, selected, setSelected)}
            onRemove={() => remove(props.url, item, setPlaylist, setCurrent)}
            onSwitchChange={() => setActive(props.url, item, setPlaylist, setCurrent)}
        />
    })

    return (
        <div className="playlist-container">
            {cards}
        </div>
    )
}

Playlist.propTypes = {
    url: PropTypes.string.isRequired
}
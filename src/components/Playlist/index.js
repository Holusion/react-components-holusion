'use strict'
import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import * as network from '../../api/network'
import {useSocket} from '../../hooks/useSocket';

function updateCurrent(url, setCurrent) {
    fetch(`http://${url}/control/current`).then(res => {
        if(res && res.status == 200) {
            res.json().then(current => setCurrent(current))
        }
    })
}

function updatePlaylist(url, setPlaylist, setCurrent) {
    fetch(`http://${url}/playlist`).then(res => {
        if(res && res.ok) {
            res.json().then(playlist => {
                setPlaylist(playlist);
                updateCurrent(url, setCurrent);
            })   
        } else if(res.status == 204) {
            setPlaylist([]);
        } else {
            throw new Error(`${res.status} - ${res.statusText}`);
        }
    })
}

export default function Playlist(props) {
    const [selected, setSelected] = useState([]);
    const [removed, setRemoved] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [current, setCurrent] = useState({});
    
    useEffect(() => updatePlaylist(props.url, setPlaylist, setCurrent), [props.url, playlist]);
    useEffect(() => updateCurrent(props.url, setCurrent), current);
    
    useSocket('current-playlist', () => updateCurrent(url, setCurrent));
    
    const cards = playlist.map(item => {
        let imgUrl = encodeURI(`http://${props.url}/medias/${item.name}?thumb=true`.trim());
        return <PlaylistItem 
            key={item.name} 
            item={item} 
            image={imgUrl}
            current={current.name == item.name}
        />
    })

    return (
        <div className="playlist-container">
            {cards}
        </div>
    )
}

/**
 * the shape of an item is :
 * {
 *   "name": string,
 *   "rank": int,
 *   "active": bool,
 *   "_id": string,
 *   "options": {   
 *      "onCheckboxChange": func(item, event),
 *      "onSwitchChange": func(item, event),
 *      "onClick": func(item, event),
 *      "onPlay": func(item, event),
 *      "onRemove": func(item, event),
 *      "current": bool,
 *      "selected": bool,
 *      "visible": bool,
 *      "image": string
 *   }
 * },
 */
Playlist.propTypes = {
    url: PropTypes.string.isRequired
}
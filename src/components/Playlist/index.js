'use strict'
import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import * as network from '../../api/network'
import {SocketProvider, useSocket} from '../../hooks/useSocket';


export default function Playlist(props) {
    const [selected, setSelected] = useState([]);
    const [removed, setRemoved] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [current, setCurrent] = useState({});
    
    function updateCurrent(url, setCurrent) {
        network.getCurrent(url).then((current) => setCurrent(current));
    }
    
    function updatePlaylist(url, setPlaylist, setCurrent) {
        network.getPlaylist(url).then((playlist) => {
            setPlaylist([...playlist]);
            updateCurrent(url, setCurrent);
        })
    }
    
    function onSynchronize(eventName, url, setCurrent) {
        switch(eventName) {
            case "current-playlist":
                updateCurrent(url, setCurrent);
                break;
            default:
                return;
        }
    }

    
    useEffect(() => {
        updatePlaylist(props.url, setPlaylist, setCurrent);
    }, [props.url, playlist])
    
    const socket = useSocket('current-playlist', () => updateCurrent(url, setCurrent));
    
    const cards = playlist.map(item => {
        let imgUrl = encodeURI(`http://${props.url}/medias/${item.name}?thumb=true`.trim());
        return <PlaylistItem 
            key={item.name} 
            item={item} 
            image={imgUrl}
            {...item.options}
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
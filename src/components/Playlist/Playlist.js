import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React from 'react'

export default function Playlist(props) {
    const cards = props.items.map(item => {
        let imgUrl = ((item.image)?encodeURI(item.image.trim()):undefined);
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
    items: PropTypes.arrayOf(PropTypes.object),
}
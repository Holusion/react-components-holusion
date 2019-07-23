import './PlaylistItem.css'
import ButtonIcon from '../ButtonIcon'
import Card from '../Card';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import PropTypes from 'prop-types'
import React from 'react'
import Switch from '../Switch';

function createTop(props) {
    return (
        <div className="playlist-item-top">
            <div className="playlist-item-top-left">
                <Checkbox onChange={props.item.onCheckboxChange} checked={props.item.selected} />
            </div>
            <div className="playlist-item-top-middle">
                <Switch checked={props.item.active} onChange={props.item.onSwitchChange}/>
            </div>
            <div className="playlist-item-top-right">
                <button className="playlist-item-remove" onClick={props.item.onRemove}>
                    <Icon name="remove" />
                </button>
            </div>
        </div>
    )
}

function createPrimary(props) {
    const display = props.item.current ? <Icon name="play" width="100" height="100" /> : null;

    return (
        <div className="playlist-item-current">
            {display}
        </div>
    )
}

function createBottom(props) {
    return (
        <div className="playlist-item-bottom">
            <div className="playlist-item-title">
                <span>{props.item.name}</span>
            </div>
            <div className="playlist-item-main-action">
                <ButtonIcon name="play" onClick={props.item.onPlay} />
            </div>
        </div>
    )
}

export default function PlaylistItem(props) {
    return (
        <div className={`playlist-item ${props.item.selected ? "selected" : ""} ${props.item.active ? "active" : ""} ${props.item.visible ? "visible" : ""}`} onClick={props.item.onClick} title={props.item.name}>
            <Card top={createTop(props)} primary={createPrimary(props)} bottom={createBottom(props)} image={props.image} />
        </div>
    )
}

PlaylistItem.propTypes = {
    item: PropTypes.object,
    image: PropTypes.string,
}
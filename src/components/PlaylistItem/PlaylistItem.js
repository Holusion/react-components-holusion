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
                <Checkbox onChange={props.onCheckboxChange} checked={props.selected} />
            </div>
            <div className="playlist-item-top-middle">
                <Switch checked={props.item.active} onChange={props.onSwitchChange}/>
            </div>
            <div className="playlist-item-top-right">
                <button className="playlist-item-remove" onClick={props.onRemove}>
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
                <ButtonIcon name="play" onClick={props.onPlay} />
            </div>
        </div>
    )
}

export default function PlaylistItem(props) {
    return (
        <div className={`playlist-item ${props.selected ? "selected" : ""} ${props.item.active ? "active" : ""} ${props.visible ? "visible" : ""}`} onClick={props.onClick} title={props.item.name}>
            <Card top={createTop(props)} primary={createPrimary(props)} bottom={createBottom(props)} image={props.image} />
        </div>
    )
}

PlaylistItem.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
        current: PropTypes.bool,
    }).isRequired,
    image: PropTypes.string,
    selected: PropTypes.bool,
    visible: PropTypes.bool,
    onClick: PropTypes.func,
    onPlay: PropTypes.func,
    onRemove: PropTypes.func,
    onSwitchChange: PropTypes.func,
    onCheckboxChange: PropTypes.func,
}

PlaylistItem.defaultProps = {
    image: undefined,
    selected: false,
    visible: true,
    onClick: () => {},
    onPlay: () => {},
    onRemove: () => {},
    onSwitchChange: () => {},
    onCheckboxChange: () => {}
}
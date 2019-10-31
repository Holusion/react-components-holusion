import './PlaylistItem.scss'
import ButtonIcon from '../ButtonIcon'
import Card from '../Card';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import Switch from '../Switch';
import MapEditor from '../MapEditor';

import IconClose from "../../icons/close.svg";


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
    const display = props.current ? <Icon name="play" width="100" height="100" /> : null;

    return (
        <div  className="playlist-item-current">
            {display}
        </div>
    )
}

function mapToObject(m){
    const res = {};
    for (let [key, value] of m){
        res[key] = value;
    }
    return res;
}

export function ItemConfig(props){
    useEffect(() => {
        function downHandler({key}){
            if(key === "Escape") props.onClose();
        }
        window.addEventListener('keydown', downHandler);
        // Remove event listeners on cleanup
        return () => window.removeEventListener('keydown', downHandler);
    }, []);

    const items = new Map(Object.keys(props.conf || {}).map((key)=> {return [key, props.conf[key]]}));

    return (<div  onClick={(e)=>{e.target.id == "item-config" && props.onClose()}} id="item-config" className="playlist-item-configuration">
        <div className="playlist-item-configuration-container container">
            <h2>Configuration de {props.name}</h2>
            <a className="playlist-item-configuration-close text-danger" onClick={()=>props.onClose()}><IconClose/></a>
            <MapEditor editable items={items} onChange={(val)=>props.onChange(mapToObject(val))}/>
        </div>
    </div>)
}

ItemConfig.propTypes = {
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    conf: PropTypes.object,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
}

export default function PlaylistItem(props) {
    const [withConfig, showConfig] = useState(false);
    const bottom = (
        <div className="playlist-item-bottom">
            <div className="playlist-item-title">
                <span>{props.item.name}</span>
            </div>
            <div className="playlist-item-main-action">
                <ButtonIcon name="menu" onClick={(e)=>{e.stopPropagation();showConfig(true)}} />
            </div>
        </div>
    )
    function handleChange(key, value){
        console.info("change key ", key, "to", value, "for : ", props.item.name);
        fetch(`/playlist/${encodeURIComponent(props.item.name)}`, {
            method:"PUT", 
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                $set:{[key]: value}
            })
        })
        .then((res)=>{
            if(!res.ok){
                res.json().then((err)=>{
                    console.error(err);//FIXME : visual report
                })
            }
        })
    }
    return (
        <div className={`playlist-item ${props.selected ? "selected" : ""} ${props.item.active ? "active" : ""} ${props.visible ? "visible" : ""}`} onClick={props.onClick} title={props.item.name}>
            {withConfig && (<ItemConfig onClose={()=>showConfig(false)} onChange={value =>handleChange("conf", value)} {...props.item}/>)}
            <Card onClick={props.onPlay} top={createTop(props)}  title={bottom} image={props.image} size="100%">{createPrimary(props)}</Card>
        </div>
    )
}

PlaylistItem.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
    }).isRequired,
    image: PropTypes.string,
    current: PropTypes.bool,
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
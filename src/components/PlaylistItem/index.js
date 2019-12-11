import './PlaylistItem.scss'
import ButtonIcon from '../ButtonIcon'
import Card from '../Card';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import PropTypes from 'prop-types'
import React, {useState, useEffect, useRef} from 'react'
import Switch from '../Switch';
import MapEditor from '../MapEditor';

import IconClose from "../../icons/close.svg";

import { useDrag, useDrop } from 'react-dnd'

const itemShape = PropTypes.shape({
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
});

function ItemTop(props) {
    return (
        <div className="playlist-item-top">
            <div className="playlist-item-top-left">
                <Checkbox onChange={props.onCheckboxChange} checked={props.selected} />
            </div>
            <div className="playlist-item-top-middle">
                <Switch checked={props.item.active} onChange={props.onSwitchChange}/>
            </div>
            <div className="playlist-item-top-right">
                <button data-test="button-remove" className="playlist-item-remove" onClick={props.onRemove}>
                    <Icon name="remove" />
                </button>
            </div>
        </div>
    )
}

ItemTop.propTypes = {
    onCheckboxChange : PropTypes.func.isRequired,
    onSwitchChange : PropTypes.func.isRequired,
    onRemove : PropTypes.func.isRequired, 
    selected : PropTypes.bool,
    item : itemShape.isRequired,
}

function ItemPrimary(props) {
    const display = props.current ? <Icon name="play" width="100" height="100" /> : null;
    return (
        <div  className="playlist-item-current" onClick={props.onClick}>
            {display}
        </div>
    )
}
ItemPrimary.propTypes = {
    current: PropTypes.bool,
    onClick: PropTypes.func,
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
            <div  className="item-configuration-title d-flex justify-content-between">
                <h2>{props.name}</h2>
            </div>
            
            <a className="playlist-item-configuration-close text-danger" onClick={()=>props.onClose()}><IconClose/></a>
            <MapEditor editable items={items} onChange={(val)=> props.onChange(mapToObject(val))}/>
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

const PlaylistItem = React.forwardRef((props,ref)=> {
    const [withConfig, showConfig] = useState(false);
    const bottom = (
        <div className="playlist-item-bottom">
            <div className="playlist-item-title" onClick={props.onPlay}>
                <span data-test="playlist-item-title">{props.item.name}</span>
            </div>
            <button className="playlist-item-main-action" onClick={(e)=>{e.stopPropagation();showConfig(true)}} >
                    <Icon name="menu" />
            </button>
        </div>
    )
    /*
     * Callback functions
     * TODO : check performance and use memoization if necessary
     */
    function handleChange(key, value){
        console.info("change key ", key, "to", value, "for : ", props.item.name);
        return fetch(`/playlist/${encodeURIComponent(props.item.name)}`, {
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
    const classes = `playlist-item ${props.selected ? "selected" : ""} ${props.item.active ? "active" : ""} ${props.visible ? "visible" : ""} ${withConfig?"with-config":""}`;
    return (
        <div ref={ref} className={classes} data-test="playlist-item" data-test-name={props.item.name} onClick={props.onClick} title={props.item.name}>
            {withConfig && (<ItemConfig onClose={()=>showConfig(false)} onChange={value =>handleChange("conf", value)} {...props.item}/>)}
            <Card
                top={<ItemTop {...props}/>}  
                title={bottom} 
                image={props.image} 
                size="100%"
            >
                <ItemPrimary current={props.current} onClick={props.onPlay} />
            </Card>
        </div>
    )
})

PlaylistItem.propTypes = {
    item: itemShape.isRequired,
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
    disabled: false,
    onClick: () => {},
    onPlay: () => {},
    onRemove: () => {},
    onSwitchChange: () => {},
    onCheckboxChange: () => {}
}
export default PlaylistItem;
export function DraggablePlaylistItem({item, moveCard, dropCard, index, ...props}){
    const id = item.name;
    const ref = useRef(null);
    const [, drop] = useDrop({
        accept: "card",
        drop: dropCard,
        hover(target) {
            if (!ref.current) {
                return
            }
            const dragIndex = target.index
            const hoverIndex = index //Self
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)
            target.index = hoverIndex
        },
    })

    const [{ isDragging }, drag] = useDrag({
        item: { type: "card", id, index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: ()=> ref.current.classList.findIndex("with-config") == -1
    })

    drag(drop(ref));
    return (<div className="drag-container" style={{opacity: isDragging? 0.3:1}}>
        <PlaylistItem ref={ref} item={item} {...props}/>
    </div>)
}
DraggablePlaylistItem.propTypes = Object.assign({}, PlaylistItem.propTypes, {
    moveCard: PropTypes.func.isRequired,
    dropCard: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
})
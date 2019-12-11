'use strict'
import "./Playlist.scss"
import {DraggablePlaylistItem} from "../PlaylistItem";
import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import {useSocket, useSocketState} from '../../hooks/useSocket';

import url from 'url'

import { DndProvider, useDrop } from 'react-dnd'
import HTML5Backend, {NativeTypes} from 'react-dnd-html5-backend';
import DragLayer from "./DragLayer";

import Uploader from "../Upload/Uploader";
import Spinner from "../Spinner";
import Fab from "../Fab";

import SendLink from "./SendLink";

import LinkIcon from "../../icons/baseline-link-24px.svg";
import UploadIcon from "../../icons/upload.svg";
import CloseIcon from "../../icons/close.svg";
import RemoveIcon from "../../icons/remove.svg"
import RefreshIcon from "../../icons/refresh.svg";
import PoweroffIcon from "../../icons/baseline-power_off-24px.svg";

import ForwardIcon from "../../icons/forward.svg";
import BackIcon from "../../icons/back.svg";

import { toast } from 'react-toastify';

const hasDnd = 'ondragstart' in document.body && "ondrop" in document.body;


function play(item) {
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(`/control/current/${item.name}`, options).then(res => {    
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            toast.error(`failed to play ${item.name} : ${err.message}`);
        }
    }).catch(err => {
        toast.error(`failed to play ${item.name} : ${err.message}`);
    })
}

function remove({name}){
    let options = {
        method: 'DELETE',
        body: null,
        headers: {
            'Content-Type': 'application/json'
        },
    }
    return fetch(`/medias/${encodeURIComponent(name)}`, options).then(res => {
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            throw err;
        }
    }).catch(err => {
        toast.error(`failed to remove ${name} : ${err.message}`);
    })
}

function deleteSelection(selection){
    return Promise.all(selection.map(name=>{
        console.warn("removing", name);
        return remove({name})
    })) //should not fail as errors are caught in remove()
}

function setActive(item) {
    let options = {
        method: 'PUT',
        body: JSON.stringify(Object.assign(item,{active:!item.active})),
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(`/playlist/${item.name}`, options).then(res => {
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            toast.error(`failed to activate ${item.name} : ${err.message}`);      
        }
    }).catch(err => {
        toast.error(`failed to activate ${item.name} : ${err.message}`);
    })
}

function unselectItem(item, selected, setSelected) {
    setSelected(selected.filter(name => name !== item.name))
}

function selectOneItem(item, setSelected) {
    setSelected([item.name]);
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
    const isSelected = selected.findIndex(name => item.name === name) != -1;
    setSelected(isSelected ? selected.filter(name => name !== item.name) : [...selected, item.name]);
}

function PlaylistContentWrap({children, onDrop, connected}){
    const [{isDragging}, drop] = useDrop({
        accept: NativeTypes.FILE,
        drop: onDrop,
        collect: monitor => ({
            isDragging: monitor.isOver({shallow: false}) && monitor.canDrop(),
        })
    })
    return (<div ref={drop} className="playlist-content-wrap">
        {isDragging && connected && <div key="drag-overlay" className="playlist-drag-overlay"/>}
        {children}
    </div>)
}

PlaylistContentWrap.propTypes = {
    onDrop: PropTypes.func.isRequired,
    connected: PropTypes.bool,
    children: PropTypes.any,
}

export default function Playlist(props) {
    const [selected, setSelected] = useState([]);
    const [uploads, setUploads] = useState([]);

    const connected = useSocketState();
    const serverItems = useSocket("change", props.items);
    const [localPlaylist, setLocalPlaylist] = useState(null);
    const current = useSocket("current", {});


    const playlist = localPlaylist? localPlaylist : serverItems;
    const onMoveCard = (dragIndex, hoverIndex)=>{
        const newPlaylist = [...playlist];
        //mutate the new playlist
        console.log("move card", dragIndex, hoverIndex);
        const [orig] = newPlaylist.splice(dragIndex,1);
        newPlaylist.splice(hoverIndex, 0, orig);
        setLocalPlaylist(newPlaylist);
        return newPlaylist;
    }

    const commitRearange = (newPlaylist)=>{

        newPlaylist = newPlaylist || playlist;
        const modified_items = newPlaylist.reduce((res, item, index)=>{
            if(item.rank != index + 1){
                res.push(Object.assign({}, item, {rank: index +1}));
            }
            return res;
        }, []);
        console.info("Changed items : ", modified_items);
        Promise.all(modified_items.map(item=> fetch(`/playlist/${encodeURIComponent(item.name)}`,{
            method:"PUT", 
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                $set:{"rank": item.rank}
            }),
        })))
        .catch(e=>{
            console.error(e);
            toast.error("Failed to reoder playlist : " + e.message);
        }).then(()=>{
            setLocalPlaylist(null);
        });
    }
    const onDropFiles = useCallback(acceptedFiles=>{
        let new_uploads = acceptedFiles.filter((f)=>{
            return ! uploads.find((u)=> u["name"] = f["name"] && u["lastModified"] == f["lastModified"])
        }).map((file)=>{
            return {
                item: (<Uploader file={file} url={url.resolve(`http://${props.url}`, "/medias")} key={file.name+file.lastModified} />),
                lastModified: file.lastModified,
                name: file.name,
                path: file.path //Drag & drop files have no path property!
            };
        })
        if(new_uploads.length != 0){
            console.log("adding a new Upload");
            setUploads(uploads.concat(new_uploads));
        }
    })


    let cards = playlist.map((item, index) => {
        let imgUrl = encodeURI(`/medias/${item.name}?thumb=true`.trim());
        return <DraggablePlaylistItem 
            moveCard={(...args)=>{onMoveCard(...args)}}
            dropCard={()=>commitRearange()}
            key={item.name} 
            index={index}
            item={item} 
            image={imgUrl}
            current={current.name == item.name}
            visible = {item.visible != null ? false : true}
            selected={selected.filter(name => item.name === name).length > 0}
            onPlay={() => play(item)}
            onClick={(event) => handleClick(props, item, selected, setSelected, event)}
            onCheckboxChange={() => handleCheckboxChange(item, selected, setSelected)}
            onRemove={() => remove(item)}
            onSwitchChange={() => setActive(item)}
        />
    })
    if(cards.length == 0 && uploads.length == 0){
        cards= (<div>
            <h3 className="color-primary">No medias on device</h3>
            <p>Drag &amp; drop a compatible file or click the upload button to begin using your device</p>
            <p>The upload button is the blue box with this icon <UploadIcon/> in the top right corner of your screen</p>
        </div>)
    }

    let content;
    if(!connected && cards.length == 0){
        content = (<Spinner active />)
    }else{
        content = (<div className="playlist-content">
            {cards}
            {uploads.map(u => u.item)}
        </div>)
    }

    let classes = "playlist-container";
    //if(isDragActive) classes += ` drag`;
    if(!connected) classes += ` disconnected`;
    let firstSelectedItem = playlist.find(item => item.name == selected[0]) || {};
    let canMoveRight = (selected.length == 1 && firstSelectedItem.rank < playlist.length);
    let canMoveLeft = (selected.length == 1 && 1 <= firstSelectedItem.rank-1); //ranks start at 1 because reasons
    function moveButton(offset){
        const idx = playlist.findIndex(item => item.name == selected[0]);
        if(idx == -1) return toast.error(`Can't find selected item : ${selected[0]}`, );
        console.info("move %d to %d", idx, idx + offset)
        commitRearange(onMoveCard(idx, idx+offset));
    }
    return (
        <div className={classes}  data-test="playlist-container" data-test-state={connected?"connected":"disconnected"} onClick={(e)=>{e.target.classList.contains("fab-container") || e.stopPropagation()}}>
            <DndProvider backend={HTML5Backend}>
                <DragLayer items={playlist}/>
                <PlaylistContentWrap onDrop={(e)=>onDropFiles(e.files)} connected={connected}>
                    {content}
                </PlaylistContentWrap>
            </DndProvider>
            
            <div data-test="drawer" className="playlist-drawer">
                <Spinner active={!connected} style={{color:"var(--theme-primary)", margin: 0}} size={34} title="Connection lost...">
                    <PoweroffIcon  style={{opacity:0.4, padding:"5px"}}/>
                </Spinner>
                <input style={{display:"none"}} type="file" multiple={true} onChange={(e)=>onDropFiles(Array.from(e.target.files))} title="Upload a new media" id="file-upload-button"/>
                <label data-test="button-upload" className="" htmlFor="file-upload-button"><UploadIcon/></label>
                <span className="folded-drawer-item" >
                    <a className="fold d-folded" data-test="button-link-unfold" onClick={(e)=>e.currentTarget.parentNode.classList.add("active")} title="Add a new link"><LinkIcon/></a>
                    <a className="fold d-unfolded" data-test="button-link-fold" onClick={(e)=>e.currentTarget.parentNode.classList.remove("active")} title="fold"><CloseIcon/></a>
                    <SendLink className="fold d-unfolded" data-test="button-link-add" style={{position:"absolute", top: 0, left: "-300px"}} uri={`http://${props.url}`}/>                    
                </span>
                <span className="drawer-spacer d-md-none"/>
                {canMoveRight && <a onClick={()=>moveButton(1)}><ForwardIcon/></a>}
                {canMoveLeft && <a onClick={()=>moveButton(-1)}><BackIcon/></a>}
                <span className="drawer-spacer d-md-none"/>
                {0 < selected.length && (<React.Fragment>
                    <a onClick={()=>deleteSelection(selected).then(()=>setSelected([]))} title="Delete selected"><RemoveIcon/></a>
                    <a onClick={()=>setSelected([])} title="deselect all"><CloseIcon/></a>
                </React.Fragment>)}
            </div>
        </div>
    )
}

Playlist.propTypes = {
    url: PropTypes.string.isRequired,
    filterBy: PropTypes.func,
    onSelectionChange: PropTypes.func,
}

Playlist.defaultProps = {
    onSelectionChange: () => {},
    filterBy: () => true,
}
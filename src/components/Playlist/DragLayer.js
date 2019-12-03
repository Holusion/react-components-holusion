
import React, { memo } from 'react'
import { useDragLayer } from 'react-dnd'

import PlaylistItem from "../PlaylistItem";

const ItemPlaceholder = memo((props)=>{
  return (<div className="drag-item-container" style={props.style}>
      <PlaylistItem {...props}/>
  </div>)
})

export default function DragLayer({items}){
  const {
      itemType,
      isDragging,
      item,
      initialOffset,
      currentOffset,
  } = useDragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
  }))
  if (!isDragging || !currentOffset) {
      return null
  }

  let {x, y} = currentOffset;
  let placeholder;
  switch(itemType){
      case 'card':
          let element = items.find(el=> el.name == item.id);
          if(!element){
              console.warn("Unable to make D&D preview");
              placeholder= null;
          }else{
              placeholder = (<ItemPlaceholder image={encodeURI(`/medias/${element.name}?thumb=true`.trim())} item={element} style={{transform:`rotate(3deg) translate(${x}px, ${y}px)`}}/>);
          }
          
          break;
      default:
          console.warn("Unknown drag type : ", itemType);
          placeholder= null;
    }
    return <div style={{position: "fixed",pointerEvents: 'none', zIndex: 100, left: 0, top: 0, width: '100%', height: '100%',}}>
        {placeholder}
    </div>
}
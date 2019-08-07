'use strict'
import "./List.css"
import PropTypes from 'prop-types'
import React, {useState} from 'react'

function handleClick(e, index, setSelected) {
    e.preventDefault();
    setSelected(index);
}

export default function List(props) {
    const [selected, setSelected] = useState(-1);

    const listItem = React.Children.toArray(props.children);
    // Children is immutable so we have to clone children to handle selected items
    const mapList = listItem.map((child, i) => {
        return React.cloneElement(child, {selected: i == selected, onClick: (ev) => {
            handleClick(ev, i, setSelected);
            if(child.props.onClick) child.props.onClick();
        }})
    })
    
    return (
        <ul className="list">
            {mapList}
        </ul>
    )

}

List.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    onClick: PropTypes.func
}
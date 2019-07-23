'use strict'
import "./ListItem.css"
import Icon from "../Icon";
import PropTypes from 'prop-types'
import React from 'react'

export default function ListItem(props) {
    return (
        <li className={`list-item ${props.selected ? "selected" : ""}`} onClick={props.onClick}>
            {props.icon ? <div className="list-icon"><Icon name={props.icon} /></div> : null}
            <span className="list-content">{props.children}</span>
        </li>
    )
}

ListItem.propTypes = {
    children: PropTypes.string,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    icon: PropTypes.string
}
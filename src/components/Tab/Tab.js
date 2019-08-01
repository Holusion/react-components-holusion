import './Tab.css'
import PropTypes from 'prop-types'
import React from 'react'

export default function Tab(props) {
    return (
        <div className={`tab-container ${props.selected ? "selected" : ""}`} onClick={props.onClick}>
            {props.text}
        </div>
    )
}

Tab.propTypes = {
    text: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
}
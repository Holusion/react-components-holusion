import './Topbar.css'
import PropTypes from 'prop-types'
import React from 'react'

export default function Topbar(props) {
    return (
        <div className="topbar">
            <div className="start">
                {props.start}
            </div>
            <span className="title">{props.title}</span>
            <div className="end">
                {props.end}
            </div>
        </div>
    )
}

Topbar.propTypes = {
    title: PropTypes.string,
    start: PropTypes.element,
    end: PropTypes.element
}
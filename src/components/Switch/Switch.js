import './Switch.css'
import PropTypes from 'prop-types'
import React from 'react'

export default function Switch(props) {
    const id = '_' + Math.random().toString(36).substr(2, 9);

    return (
        <div className="switch-container">
            <input type="checkbox" className="switch" title={props.title} id={id} defaultChecked={props.checked} onChange={props.onChange} />
            <label htmlFor={id} />
        </div>
    )
}

Switch.propTypes = {
    title: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
}
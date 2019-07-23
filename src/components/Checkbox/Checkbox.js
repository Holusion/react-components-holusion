import './Checkbox.css'
import PropTypes from 'prop-types'
import React from 'react'

export default function Checkbox(props) {
    const id = '_' + Math.random().toString(36).substr(2, 9)
    
    return (
        <div className="checkbox-container">
            <input type="checkbox" className="checkbox" title={props.title} id={id} checked={props.checked} onChange={props.onChange}/>
            <label htmlFor={id} />
        </div>
    )
}

Checkbox.propTypes = {
    title: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.bool
}
import './Checkbox.scss'
import PropTypes from 'prop-types'
import React, {useState} from 'react'

export default function Checkbox(props) {
    const [id] = useState('_' + Math.random().toString(36).substr(2, 9))
    
    return (
        <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" title={props.title} id={id} checked={props.checked} onChange={props.onChange}/>
            <label htmlFor={id} className="custom-control-label">{props.label}</label>
        </div>
    )
}

Checkbox.propTypes = {
    title: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.bool
}
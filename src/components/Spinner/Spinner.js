import "./Spinner.css"
import PropTypes from 'prop-types'
import React from 'react'

export default function Spinner({active, className, size={}, style=40, ...props}) {
    return (
        <div 
            className={`spinner ${className||""}${active !== false ? " active" : ""}`} 
            style={Object.assign(style, {width:size, paddingLeft: size/2})}       
            {...props}>
            <div className="spinner-content" style={{width:size, height: size, marginLeft: -size/2}}>
                <span></span>
            </div>
        </div>
    )
}

Spinner.propTypes = {
    active: PropTypes.bool,
    absolute: PropTypes.bool,
    size: PropTypes.integer
}

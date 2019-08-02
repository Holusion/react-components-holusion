import "./Spinner.css"
import PropTypes from 'prop-types'
import React from 'react'

export default function Spinner({active, className, ...props}) {
    return (
        <div className={`spinner ${className||""}${active !== false ? " active" : ""}`} {...props}>
            <div className="spinner-content">
                <span></span>
            </div>
        </div>
    )
}

Spinner.propTypes = {
    active: PropTypes.bool,
    absolute: PropTypes.bool
}
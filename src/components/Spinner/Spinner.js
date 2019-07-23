import "./Spinner.css"
import PropTypes from 'prop-types'
import React from 'react'

export default function Spinner(props) {
    return (
        <div className={`spinner ${props.active ? "active" : ""} ${props.absolute ? "absolute" : ""}`}>
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
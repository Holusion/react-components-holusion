import './Card.css'
import PropTypes from 'prop-types'
import React from 'react'

export default function Card(props) {
    return (
        <div className="card">
            <div className="card-background-image" style={{backgroundImage: `url(${props.image})`}}></div>
            <div className="card-content">
                <div className="card-top">
                    {props.top}
                </div>
                <div className="card-primary">
                    {props.primary}
                </div>
                <div className="card-bottom">
                    {props.bottom}
                </div>
            </div>
        </div>
    )
}

Card.propTypes = {
    top: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    primary: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    bottom: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    image: PropTypes.string
}
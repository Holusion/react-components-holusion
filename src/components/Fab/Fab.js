import './Fab.css'
import Icon from '../Icon';
import PropTypes from 'prop-types'
import React from 'react'

export default function Fab(props) {
    return (
        <div className="fab-container" onClick={props.onClick} title={props.title}>
            <Icon name={props.icon} />
        </div>
    )
}

Fab.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.string,
    title: PropTypes.string
}
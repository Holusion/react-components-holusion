import "./ButtonIcon.css";
import Icon from "../Icon";
import PropTypes from 'prop-types'
import React from 'react';

export default function ButtonIcon(props) {
    return (
        <a className="button-icon" onClick={props.onClick} title={props.title}>
            <Icon name={props.name}/>
        </a>
    )
}

ButtonIcon.propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func
}
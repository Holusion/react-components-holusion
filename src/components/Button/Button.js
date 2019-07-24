import "./Button.css"
import PropTypes from 'prop-types';
import React from 'react';

export default function Button(props) {
    return (
        <button className="button" onClick={props.onClick} type={props.type}>
            {props.children}
        </button>
    )
}

Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    onClick: PropTypes.func,
    type: PropTypes.string
}
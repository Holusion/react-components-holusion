import "./Button.css"
import PropTypes from 'prop-types';
import React from 'react';

export default function Button(props) {
    return (
        <div className="button">
            {props.children}
        </div>
    )
}

Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
}
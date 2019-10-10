import "./Button.css"
import PropTypes from 'prop-types';
import React from 'react';

export default function Button({children, onClick, type, ...otherProps}) {
    return (
        <button onClick={onClick} type={type} {...otherProps}>
            {children}
        </button>
    )
}

Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
    onClick: PropTypes.func,
    type: PropTypes.string
}
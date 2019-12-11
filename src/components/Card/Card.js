import './Card.scss'
import PropTypes from 'prop-types'
import React from 'react'

export default function Card({title, children, top, size=200, image, style={}, ...props}) {

    const backGroundStyle = (image)? {backgroundImage: `url(${image})`} : {background: "var(--theme-primary)"};
    return (
        <div className="card" style={Object.assign(style, {width:size, height:size})} {...props}>

            
            <div className="card-content" data-test="card-background" style={backGroundStyle}>
                <div className="card-top">
                    {top}
                </div>
                <div className="card-primary">
                    {children}
                </div>
            </div>
            
            <div className="card-bottom">
                {title}
            </div>
        </div>
    )
}

Card.propTypes = {
    top: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    image: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
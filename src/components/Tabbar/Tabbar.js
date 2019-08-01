import './Tabbar.css'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'

function createSliderStyle(props, count, selected) {
    const width = 360 / count;
    const pos = count % 2 === 0 ? -width - width * (1 - selected) : -(width / 2) - width * (1 - selected)

    return {
        width: width,
        transform: `translateX(${pos}px)`,
    }
}

function handleClick(e, index, setSelected) {
    e.preventDefault();
    setSelected(index);
}

export default function Tabbar(props) {
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        React.Children.toArray(props.children).forEach((elem, i) => {
            if(elem.props.selected) setSelected(i);
        })
    }, [props.children]);

    const sliderStyle = createSliderStyle(props, React.Children.count(props.children), selected);

    const mapTab = React.Children.toArray(props.children).map((child, i) => {
        return React.cloneElement(child, {selected: i == selected, onClick: (ev) => {
            handleClick(ev, i, setSelected);
            if(child.props.onClick) child.props.onClick();
        }})
    })

    return (
        <div className="tabbar-container">
            <div className="tabbar-content">
                {mapTab}
            </div>
            <div className="tabbar-slider" style={sliderStyle}></div>
        </div>
    )
}

Tabbar.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
}
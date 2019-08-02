import './Tabbar.css'
import PropTypes from 'prop-types'
import React, {useState} from 'react'

function createSliderStyle(props, count, selected) {
    const width = 360 / count;
    const selectedPos = selected * width;
    const pos = selectedPos - count / 2 * width;

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
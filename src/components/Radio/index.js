'use strict';
import './Radio.css'
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'


function RadioButton(props){
  return (<label id={props.label} className="radio-button">
    {props.label}
    <input onChange={props.onChange} type="radio" checked={props.checked} name="radio"  aria-labelledby={props.label} value={props.value}/>
    <span className="checkmark"></span>
  </label>)
}

RadioButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired
}

export default function Radio(props){
  const [selectedValue, setSelected] = useState(props.checked);
  const selectedIndex = (typeof selectedValue !== "undefined")? props.items.findIndex(({value}) => value.toString() === selectedValue.toString()) : 0;
  const children = props.items.map(({label, value}, idx) => {
    return (<RadioButton label={label}  value={value} checked={idx == selectedIndex} key={idx} onChange={e=> {
      setSelected(e.target.value);
      (typeof props.onChange === 'function' ) && props.onChange(e.target.value);
    }}></RadioButton>)
  })

  return (
    <div className="radio-container row">
      {children}
    </div>
  )
}

Radio.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label:PropTypes.string.isRequired,
    value: PropTypes.any
  })).isRequired,
  checked: PropTypes.any,
  onChange: PropTypes.func
}
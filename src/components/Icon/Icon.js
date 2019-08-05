'use strict';
import PropTypes from 'prop-types'
import React from "react";

import back from '../../icons/back.svg'
import build from '../../icons/build.svg'
import check from '../../icons/check.svg'
import close from '../../icons/close.svg'
import filter from '../../icons/filter.svg'
import library from '../../icons/library.svg'
import menu from '../../icons/menu.svg'
import pause from '../../icons/pause.svg'
import play from '../../icons/play.svg'
import refresh from '../../icons/refresh.svg'
import remove from '../../icons/remove.svg'
import toggle_off from '../../icons/toggle_off.svg'
import toggle_on from '../../icons/toggle_on.svg'
import upload from '../../icons/upload.svg'

const icons = {back, build, check, close, filter, library, menu, pause, play, refresh, remove, toggle_off, toggle_on, upload}

export default function Icon(props) {
  if(icons[props.name]) {
    const width = props.width ? props.width : "24";
    const height = props.height ? props.height : "24";

    return React.createElement(icons[props.name], {width: width, height: height, viewBox: "0 0 24 24", fill: "currentColor"})
  }
  return null;
}

Icon.propTypes = {
  name: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string
}
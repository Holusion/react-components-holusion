'use strict';
import PropTypes from 'prop-types'
import React from "react";

import back from '../../../public/static/icons/back.svg'
import build from '../../../public/static/icons/build.svg'
import check from '../../../public/static/icons/check.svg'
import close from '../../../public/static/icons/close.svg'
import filter from '../../../public/static/icons/filter.svg'
import library from '../../../public/static/icons/library.svg'
import menu from '../../../public/static/icons/menu.svg'
import pause from '../../../public/static/icons/pause.svg'
import play from '../../../public/static/icons/play.svg'
import refresh from '../../../public/static/icons/refresh.svg'
import remove from '../../../public/static/icons/remove.svg'
import toggle_off from '../../../public/static/icons/toggle_off.svg'
import toggle_on from '../../../public/static/icons/toggle_on.svg'
import upload from '../../../public/static/icons/upload.svg'

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
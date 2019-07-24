'use strict';
import renderer from 'react-test-renderer';
import Radio from '../../src/components/Radio';
import React from "react";
import { exportAllDeclaration } from '@babel/types';

test('can set default selected box', ()=>{
  let res = renderer.create(<Radio items={[{label:"foo", value:"value1"}, {label: "bar", value: "value2"}]} checked="value1" />);

  let checked_box = res.root.findByProps({checked: true});
  console.log("Props : ", checked_box.props)
  expect(checked_box.props).toHaveProperty("label", "foo");

  let unchecked_box = res.root.findByProps({checked: false});
  expect(unchecked_box.props).toHaveProperty("label", "bar");

  res = renderer.create(<Radio items={[{label:"foo", value:"value1"}, {label: "bar", value: "value2"}]} checked="value2" />);

  checked_box = res.root.findByProps({checked: true});
  expect(checked_box.props).toHaveProperty("label", "bar");

  unchecked_box = res.root.findByProps({checked: false});
  expect(unchecked_box.props).toHaveProperty("label", "foo");
})
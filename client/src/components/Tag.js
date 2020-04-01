import React from 'react';
import { Tag } from 'antd';

export default function CustomTag({ text }) {
  let color;

  switch (text) {
    case 'animation':
      color = 'blue';
      break;
    case 'website':
      color = 'green';
      break;
    case 'artwork':
      color = 'red';
      break;
    default:
      color = 'pink';
      break;
  }

  return (
    <Tag color={color} key={text}>
      {text.toUpperCase()}
    </Tag>
  );
}

import React from 'react';
import { Select } from 'antd';

export default function SearchBar({
  placeholder = 'placeholder',
  data = ['item 1', 'item 2', 'item 3'],
}) {
  // TODO pass this to parent component (which is dynamic)
  const handleChange = () => {
    console.log('search bar changed');
  };

  return (
    <Select
      mode='multiple'
      placeholder={placeholder}
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      {data.map((v, i) => (
        <Select.Option key={`${i}: ${v}`} value={v} label={v}>
          {v}
        </Select.Option>
      ))}
    </Select>
  );
}

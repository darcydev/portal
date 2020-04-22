import React from 'react';
import { Select } from 'antd';

const createSelectOptions = (dataArray) => {
  return dataArray.map((v, i) => (
    <Select.Option key={`${i}: ${v}`} value={v} label={v}>
      {v}
    </Select.Option>
  ));
};

export default function SelectBar({
  optionsData = ['item 1', 'item 2', 'item 3'],
  props,
  passData,
}) {
  // TODO pass this to parent component (which is dynamic)
  const handleChange = (e) => {
    passData(e);
  };

  return (
    <Select {...props} onChange={handleChange} style={{ width: '100%' }}>
      {createSelectOptions(optionsData)}
    </Select>
  );
}

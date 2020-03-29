import React from 'react';
import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';

export default function BigSquareButton({
  icon = <SearchOutlined style={{ fontSize: '30px' }} />,
  text = 'default',
  onClick
}) {
  return (
    <StyledButton onClick={onClick}>
      <div className='content'>
        {icon}
        <span className='text'>{text}</span>
      </div>
    </StyledButton>
  );
}

const StyledButton = styled.button`
  width: 150px;
  height: 120px;
  background: grey;
  border-radius: 10px;

  .content {
    display: flex;
    flex-direction: column;

    .text {
      font-size: 17px;
      text-transform: uppercase;
    }
  }
`;

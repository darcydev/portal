import React from 'react';
import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';

export default function BigSquareButton({
  icon = <SearchOutlined style={{ fontSize: '30px' }} />,
  text = 'default',
  onClick
}) {
  return (
    <StyledButton onClick={onClick} className='btn__big-square'>
      <div className='content'>
        {icon}
        <span className='text'>{text}</span>
      </div>
    </StyledButton>
  );
}

const StyledButton = styled.button`
  width: 200px;
  height: 160px;
  background: rgb(170, 170, 170);
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

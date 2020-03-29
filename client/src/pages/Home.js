import React from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import {
  UserAddOutlined,
  FolderAddOutlined,
  TeamOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';

import BigSquareButton from '../components/Buttons/BigSquareButton';

export default function Home() {
  const ICON_SIZE = '30px';

  return (
    <div>
      <div className='banner'>
        <h1>Welcome to the Portal</h1>
        <h3>The place to hold all your client information</h3>
      </div>
      <div className='button-group'>
        <BigSquareButton
          icon={<UserAddOutlined style={{ fontSize: ICON_SIZE }} />}
          text='NEW CLIENT'
          onClick={() => console.log('new client btn clicked -> open modal')}
        />
        <BigSquareButton
          icon={<FolderAddOutlined style={{ fontSize: ICON_SIZE }} />}
          text='NEW JOB'
          onClick={() => console.log('new job btn clicked -> open modal')}
        />
        <StyledLink to='/clients' className='btn__big-square'>
          <FolderOpenOutlined style={{ fontSize: ICON_SIZE }} />
          <span>VIEW CLIENTS</span>
        </StyledLink>
        <StyledLink to='/jobs' className='btn__big-square'>
          <FolderOpenOutlined style={{ fontSize: ICON_SIZE }} />
          <span>VIEW JOBS</span>
        </StyledLink>
      </div>
    </div>
  );
}

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  color: inherit;
  text-align: center;
  font-size: 17px;
`;

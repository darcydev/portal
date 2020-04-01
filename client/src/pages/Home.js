import React from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import {
  TeamOutlined,
  FolderOpenOutlined,
  ProfileOutlined
} from '@ant-design/icons';

import NewClient from '../components/Modals/NewClient';
import NewJob from '../components/Modals/NewJob';

export default function Home() {
  const ICON_SIZE = '30px';

  return (
    <div>
      <div className='banner'>
        <h1>Welcome to the Portal</h1>
        <h3>The place to hold all your client information</h3>
      </div>
      <StyledFlexContainer>
        <NewClient />
        <NewJob />
        <StyledLink to='/clients' className='btn__big-square'>
          <div>
            <FolderOpenOutlined style={{ fontSize: ICON_SIZE }} />
            <span>VIEW CLIENTS</span>
          </div>
        </StyledLink>
        <StyledLink to='/jobs' className='btn__big-square'>
          <div>
            <FolderOpenOutlined style={{ fontSize: ICON_SIZE }} />
            <span>VIEW JOBS</span>
          </div>
        </StyledLink>
        <StyledLink to='/clients' className='btn__big-square'>
          <div>
            <ProfileOutlined style={{ fontSize: ICON_SIZE }} />
            <span>GRAVEYARD</span>
          </div>
        </StyledLink>
      </StyledFlexContainer>
    </div>
  );
}

const StyledFlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  color: inherit;
  text-align: center;
  font-size: 17px;

  div {
    display: flex;
    flex-direction: column;
    margin: auto;
  }
`;

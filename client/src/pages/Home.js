import React from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { FolderOpenOutlined, ProfileOutlined } from '@ant-design/icons';

import NewClient from '../components/Modals/NewClient';

export default function Home() {
  const ICON_SIZE = '30px';

  return (
    <div>
      <StyledBanner>
        <h1>Client Portal</h1>
      </StyledBanner>
      <StyledFlexContainer>
        <NewClient />
        <StyledLink to='/new-job' className='btn__big-square'>
          <div>
            <FolderOpenOutlined style={{ fontSize: ICON_SIZE }} />
            <span>NEW JOB</span>
          </div>
        </StyledLink>
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
        <StyledLink to='/graveyard' className='btn__big-square'>
          <div>
            <ProfileOutlined style={{ fontSize: ICON_SIZE }} />
            <span>GRAVEYARD</span>
          </div>
        </StyledLink>
      </StyledFlexContainer>
    </div>
  );
}

const StyledBanner = styled.div`
  height: 300px;
  text-align: center;
  padding: 20px;

  h1 {
    font-size: 60px;
  }
`;

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
  margin: 10px;

  div {
    display: flex;
    flex-direction: column;
    margin: auto;
  }
`;

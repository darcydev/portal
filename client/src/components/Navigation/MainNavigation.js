import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import media from 'styled-media-query';

import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

export default function MainNavigation() {
  const AUTH_CONTEXT = useContext(AuthContext);

  return (
    <StyledContainer>
      <NavLink to='/home'>
        <h1>LOGO</h1>
      </NavLink>
      <StyledNav>
        <ul style={{ display: 'flex' }}>
          {!AUTH_CONTEXT.token && (
            <li>
              <NavLink to='/auth'>Login</NavLink>
            </li>
          )}
          {AUTH_CONTEXT.token && (
            <>
              <li>
                <NavLink to='/clients'>Clients</NavLink>
              </li>
              <li>
                <NavLink to='/jobs'>Jobs</NavLink>
              </li>
              <li>
                <NavLink to='/files'>Files</NavLink>
              </li>
              <li onClick={() => AUTH_CONTEXT.logout()}>Logout</li>
            </>
          )}
        </ul>
      </StyledNav>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledNav = styled.nav`
  margin-left: 1.5rem;
  margin: auto 0;

  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 22px;

    ${media.lessThan('medium')`
      flex-direction: column;
      font-size: 16px;
    `}

    li {
      margin: 0 1rem;

      a {
        text-decoration: none;

        :hover,
        :active {
          color: #f8e264;
        }
      }
    }
  }
`;

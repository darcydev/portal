import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

export default function MainNavigation() {
  const [isOpen, toggleOpen] = useState(false);

  const AUTH_CONTEXT = useContext(AuthContext);

  return (
    <StyledHeader className='Navbar'>
      <div>
        <NavLink to='/home'>
          <h1>LOGO</h1>
        </NavLink>
        <StyledMenuButton
          className='toggle'
          onClick={() => toggleOpen(!isOpen)}
        >
          {isOpen ? <UpOutlined /> : <DownOutlined />}
        </StyledMenuButton>
      </div>
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
              <li onClick={() => AUTH_CONTEXT.logout()}>Logout</li>
            </>
          )}
        </ul>
        {/*        <ul>
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
              <li onClick={() => AUTH_CONTEXT.logout()}>Logout</li>
            </>
          )}
        </ul> */}
      </StyledNav>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 3.5rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  color: #fff;
`;

const StyledMenuButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  &:focus {
    outline: 0;
  }
`;

const StyledNav = styled.nav`
  margin-left: 1.5rem;

  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

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

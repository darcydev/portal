import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, Menu, Breadcrumb } from 'antd';

import AuthContext from '../../context/auth-context';

const { Header } = Layout;

export default function MainNavigation() {
  const AUTH_CONTEXT = useContext(AuthContext);

  return (
    <StyledHeader>
      <StyledLogo>
        <NavLink to='/home'>
          <h1>LOGO</h1>
        </NavLink>
      </StyledLogo>
      <StyledNav>
        <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['2']}>
          <Menu.Item key='1'>nav 1</Menu.Item>
          <Menu.Item key='2'>nav 2</Menu.Item>
          <Menu.Item key='3'>nav 3</Menu.Item>
        </Menu>
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
  background: #01d1d1;
  padding: 0 1rem;
  display: flex;
  align-items: center;
`;

const StyledLogo = styled.div`
  h1 {
    margin: 0;
    font-size: 1.5rem;
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
        color: #000;

        :hover,
        :active {
          color: #f8e264;
        }
      }
    }
  }
`;

import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export default function MainNavigation() {
  return (
    <StyledHeader>
      <StyledLogo>
        <h1>LOGO</h1>
      </StyledLogo>
      <StyledNav>
        <ul>
          <li>
            <NavLink to='/auth'>Authenticate</NavLink>
          </li>
          <li>
            <NavLink to='/clients'>Clients</NavLink>
          </li>
          <li>
            <NavLink to='/jobs'>Jobs</NavLink>
          </li>
          <li>Logout</li>
        </ul>
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

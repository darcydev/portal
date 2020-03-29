import React from 'react';
import styled from 'styled-components';
import MainNavigation from './Navigation/MainNavigation';

export default function Header() {
  return (
    <StyledHeader>
      <MainNavigation />
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

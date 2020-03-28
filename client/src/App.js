import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import styled from 'styled-components';

import AuthPage from './pages/Auth';
import ClientPage from './pages/Clients';
import JobPage from './pages/Jobs';

import MainNavigation from './components/Navigation/MainNavigation';

export default function App() {
  return (
    <BrowserRouter>
      <>
        <MainNavigation />
        <StyledMain>
          <Switch>
            <Redirect from='/' to='/auth' exact />
            <Route path='/auth' component={AuthPage} />
            <Route path='/clients' component={ClientPage} />
            <Route path='/jobs' component={JobPage} />
          </Switch>
        </StyledMain>
      </>
    </BrowserRouter>
  );
}

const StyledMain = styled.main`
  margin: 4rem 2.5rem;
`;

import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';

import HomePage from './pages/Home';
import AuthPage from './pages/Auth';
import ClientsPage from './pages/Clients';
import SingleClientPage from './pages/SingleClient';
import JobsPage from './pages/Jobs';
import SingleJobPage from './pages/SingleJob';
import MainNavigation from './components/Navigation/MainNavigation';
import NewClient from './components/Modals/NewClient';

import AuthContext from './context/auth-context';
import Footer from './components/Footer';

export default function App() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const login = (token, userId, tokenExpiration) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    /* TODO redirect to /home */
    window.location.reload();
  };

  const logout = () => {
    localStorage.clear('token');
    localStorage.clear('userId');
    /* TODO redirect to /auth */
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <>
        <AuthContext.Provider
          value={{ token: token, userId: userId, login: login, logout: logout }}
        >
          <StyledHeader>
            <MainNavigation />
          </StyledHeader>
          <Layout.Content
            style={{ maxWidth: 1024, margin: 'auto', minHeight: '90vh' }}
          >
            <Switch>
              {token ? (
                <Redirect from='/' to='/home' exact />
              ) : (
                <Redirect from='/' to='/auth' exact />
              )}
              {!token && <Route path='/auth' component={AuthPage} />}
              {token && <Route path='/home' component={HomePage} />}
              {token && <Route path='/clients' component={ClientsPage} />}
              {token && (
                <Route path='/client/:code' component={SingleClientPage} />
              )}
              {token && <Route path='/jobs' component={JobsPage} />}
              {token && <Route path='/job/:code' component={SingleJobPage} />}
            </Switch>
          </Layout.Content>
          <Footer />
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
}

const StyledHeader = styled.header`
  background: #7cfdfd;
  padding: 20px;
`;

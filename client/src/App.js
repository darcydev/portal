import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import ClientPage from './pages/Client';

import MainNavigation from './components/Navigation/MainNavigation';

export default function App() {
  return (
    <BrowserRouter>
      <>
        <MainNavigation />
        <main>
          <Switch>
            <Redirect from='/' to='/auth' exact />
            <Route path='/auth' component={AuthPage} />
            <Route path='/clients' component={ClientPage} />
          </Switch>
        </main>
      </>
    </BrowserRouter>
  );
}

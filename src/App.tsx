import React, { FC } from 'react';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

import { AppNavbar } from './common/App-Navbar';
import { Routes } from './router/Routes';

export const App: FC = () => {
  return (
    <Router>
      <CssBaseline />
      <AppNavbar />
      <Routes />
    </Router>
  );
};

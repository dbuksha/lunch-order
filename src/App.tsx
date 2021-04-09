import React, { FC } from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

import { Routes } from './router/Routes';

export const App: FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="sm" component="main">
        <h1>Lanchos</h1>

        <Routes />
      </Container>
    </Router>
  );
};

import React, { FC, useEffect } from 'react';
import * as Joi from 'joi';
import { Container, CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

import { Routes } from 'router/Routes';
import { envSchema } from 'utils/env-schema';
import SnackBar from 'components/SnackBar';

export const App: FC = () => {
  // check required credentials
  useEffect(() => {
    Joi.attempt(process.env, envSchema);
  }, []);

  return (
    <Router>
      <CssBaseline />
      <Container fixed component="main">
        <h1>Lanchos</h1>
        <SnackBar />

        <Routes />
      </Container>
    </Router>
  );
};

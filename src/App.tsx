import React, { FC, useEffect } from 'react';
import * as Joi from 'joi';

import { Container, CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

import { Routes } from './router/Routes';
import { envSchema } from './utils/env-schema';

export const App: FC = () => {
  useEffect(() => {
    Joi.attempt(process.env, envSchema);
  }, []);

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

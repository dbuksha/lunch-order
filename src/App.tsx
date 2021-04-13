import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Joi from 'joi';

import { Container, CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

import { Routes } from './router/Routes';
import { envSchema } from './utils/env-schema';
import { fetchDishes } from './store/dishes';

export const App: FC = () => {
  const dispatch = useDispatch();
  // check required credentials
  useEffect(() => {
    Joi.attempt(process.env, envSchema);
  }, []);

  useEffect(() => {
    dispatch(fetchDishes());
  }, [dispatch]);

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

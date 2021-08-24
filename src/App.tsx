import React, { FC, useEffect } from 'react';
import * as Joi from 'joi';
import {
  Container,
  createStyles,
  CssBaseline,
  makeStyles,
  Typography,
  Link,
} from '@material-ui/core';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';

import { Routes } from 'router/Routes';
import { envSchema } from 'utils/env-schema';
import SnackBar from 'components/SnackBar';
import logo from './logo.svg';

const useStyles = makeStyles(() =>
  createStyles({
    appHeader: {
      margin: '0.5rem 0',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      '&:hover': {
        textDecoration: 'none',
      },
    },
    appLogo: {
      width: '3em',
      height: '3em',
      marginRight: '1em',
    },
    appLabel: {
      fontWeight: 'bold',
      fontSize: '2em',
      color: 'rgba(0, 0, 0, 0.87)',
    },
  }),
);

export const App: FC = () => {
  const classes = useStyles();
  // check required credentials
  useEffect(() => {
    Joi.attempt(process.env, envSchema);
  }, []);

  return (
    <Router>
      <CssBaseline />
      <>
        <SnackBar />
        <Routes />
      </>
      {/* <Container fixed component="main">
        <Link component={RouterLink} to="/" className={classes.appHeader}>
          <img src={logo} alt="Logo" className={classes.appLogo} />
          <Typography variant="h6" className={classes.appLabel}>
            Lanchos
          </Typography>
        </Link>
        <SnackBar />
        <Routes />
      </Container> */}
    </Router>
  );
};

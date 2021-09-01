import React, { FC } from 'react';
import { Box } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { checkAuth } from 'utils/checkAuth';

import LoginForm from './LoginForm';

const Login: FC = () => {
  if (checkAuth()) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return (
    <Box>
      <LoginForm />
    </Box>
  );
};

export default Login;

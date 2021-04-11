import React, { FC } from 'react';
import { Box } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { RootState } from 'store';
import LoginForm from './LoginForm';

const Login: FC = () => {
  const currentUser = useSelector((state: RootState) => state.users.user);

  if (currentUser) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return (
    <Box p={2}>
      <LoginForm />
    </Box>
  );
};

export default Login;

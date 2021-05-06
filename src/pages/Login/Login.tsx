import React, { FC } from 'react';
import { Box } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getCurrentUser } from 'store/users';
import LoginForm from './LoginForm';

const Login: FC = () => {
  const currentUser = useSelector(getCurrentUser);

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

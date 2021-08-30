import React, { FC } from 'react';
import { Box } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { checkAuth } from 'utils/checkAuth';

import LoginFormNew from './LoginFormNew';

const Login: FC = () => {
  if (checkAuth()) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return (
    <Box>
      <LoginFormNew />
    </Box>
  );
};

export default Login;

import React, { FC } from 'react';
import { Box } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import UsersForm from 'components/users/Users-Form';
import { RootState } from 'store';

const Login: FC = () => {
  const currentUser = useSelector((state: RootState) => state.users.user);

  if (currentUser) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return (
    <>
      <Box p={2}>
        <UsersForm />
      </Box>
    </>
  );
};

export default Login;

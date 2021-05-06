import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSnackBar, getSnackBar } from 'store/app';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const SnackBar: FC = () => {
  const snackbar = useSelector(getSnackBar);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(clearSnackBar());
  };

  if (!snackbar) return null;

  const { message, status } = snackbar;
  return (
    <Snackbar
      open={!!snackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={status}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;

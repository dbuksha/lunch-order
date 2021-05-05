import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box, createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      background: 'rgba(255,255,255,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

const Loader: FC = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <CircularProgress />
    </Box>
  );
};
export default Loader;
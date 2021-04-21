import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box, createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
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

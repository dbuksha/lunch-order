import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box, createStyles, makeStyles } from '@material-ui/core';
import { colors } from 'utils/colors';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: colors.mediumOpacityWhite,
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
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

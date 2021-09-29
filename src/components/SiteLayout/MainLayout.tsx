import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import SiteHeader from './SiteHeader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    navigation: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
    },
    wrapper: {
      width: '100%',
      display: 'flex',
    },
    content: {
      width: '100%',
      display: 'flex',
      paddingTop: 64,
      [theme.breakpoints.down('sm')]: {
        paddingTop: 56,
      },
    },
  }),
);

const MainLayout: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <SiteHeader />
      </div>
      <div className={classes.wrapper}>
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;

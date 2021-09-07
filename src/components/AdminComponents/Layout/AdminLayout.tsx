import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core';

import { getUserSelector } from 'store/users';

import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f4f6f8',
    },
    navigation: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
    },
    menu: {
      position: 'fixed',
      top: 64,
      left: 0,
      zIndex: 90,
    },
    wrapper: {
      width: '100%',
      display: 'flex',
      paddingLeft: 256,
    },
    content: {
      width: '100%',
      display: 'flex',
      paddingTop: 64,
    },
  }),
);

const AdminLayout: FC = ({ children }) => {
  const classes = useStyles();
  const user = useSelector(getUserSelector);

  if (user && user.role !== 'admin') {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <DashboardNavbar />
      </div>
      <div className={classes.menu}>
        <DashboardSidebar />
      </div>
      <div className={classes.wrapper}>
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;

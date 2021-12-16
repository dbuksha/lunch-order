import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { getUserSelector } from 'store/users';
import { getDepositModeSelector } from 'store/settings';

import { colors } from 'utils/colors';

import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: colors.blueness,
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
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 0,
      },
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
  const depositMode = useSelector(getDepositModeSelector);
  const [mobileMenu, setMobileMenu] = useState(false);

  if (user && user.role !== 'admin') {
    return <Redirect to={{ pathname: '/' }} />;
  }

  const changeMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <DashboardNavbar
          mobileMenu={mobileMenu}
          changeMobileMenu={changeMobileMenu}
        />
      </div>
      <div className={classes.menu}>
        <DashboardSidebar depositMode={depositMode} mobileMenu={mobileMenu} />
      </div>
      <div className={classes.wrapper}>
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;

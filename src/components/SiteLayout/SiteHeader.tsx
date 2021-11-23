import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';

import { getUserSelector } from 'store/users';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { logout } from 'utils/auth';

import LogoImg from 'assets/images/logo.svg';
import { getDepositModeSelector } from 'store/settings';
import { UserNew } from 'entities/User';

type PropsInfo = {
  user: UserNew;
  depositMode?: boolean;
  classes: {
    [key: string]: string;
  };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
    },
    logo: {
      width: '50px',
      height: '50px',
      [theme.breakpoints.down('sm')]: {
        width: '30px',
        height: '30px',
      },
    },
    title: {
      fontSize: 24,
      fontWeight: 700,
      color: '#fff',
      marginLeft: 8,
      textDecoration: 'none',
      [theme.breakpoints.down('sm')]: {
        fontSize: 16,
      },
    },
    userBlock: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      width: 50,
      height: 50,
      marginRight: 8,
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    name: {
      fontSize: 16,
      color: '#fff',
      [theme.breakpoints.down('sm')]: {
        fontSize: 14,
      },
    },
    btnExit: {
      width: 40,
      minWidth: 40,
      height: 40,
      marginLeft: 8,
      [theme.breakpoints.down('sm')]: {
        width: 30,
        minWidth: 30,
        height: 30,
        marginLeft: 4,
      },
    },
    exit: {
      fill: '#fff',
    },
  }),
);

const ProfileInfo: FC<PropsInfo> = ({ user, depositMode, classes }) => {
  const UserInfo = () => (
    <>
      {user.avatar ? (
        <Avatar src={user.avatar} className={classes.avatar} />
      ) : null}
      <Typography color="textPrimary" variant="h5" className={classes.name}>
        {user.name || ''}
      </Typography>
    </>
  );

  return (
    <>
      {depositMode ? (
        <RouterLink to="/profile" className={classes.container}>
          <UserInfo />
        </RouterLink>
      ) : (
        <UserInfo />
      )}
    </>
  );
};

const SiteHeader: FC = () => {
  const classes = useStyles();
  const user = useSelector(getUserSelector);
  const depositMode = useSelector(getDepositModeSelector);

  return (
    <AppBar elevation={0}>
      <Toolbar>
        <RouterLink to="/" className={classes.container}>
          <Avatar src={LogoImg} className={classes.logo} />
          <Typography className={classes.title} component="span" variant="h2">
            Lanchos
          </Typography>
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Box className={classes.userBlock}>
          {user ? (
            <>
              {window.location.pathname !== '/profile' ? (
                <ProfileInfo
                  user={user}
                  depositMode={depositMode}
                  classes={classes}
                />
              ) : null}
              <Button className={classes.btnExit} onClick={() => logout()}>
                <ExitToAppIcon className={classes.exit} />
              </Button>
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SiteHeader;

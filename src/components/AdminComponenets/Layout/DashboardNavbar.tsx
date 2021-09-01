import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import LogoImg from '../../../logo.svg';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
    },
    logo: {
      width: 50,
      height: 50,
    },
    title: {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      fontSize: 24,
      fontWeight: 700,
      color: '#fff',
      marginLeft: 8,
      textDeraration: 'none',
    },
  }),
);

const DashboardNavbar: FC = () => {
  const classes = useStyles();

  return (
    <AppBar elevation={0}>
      <Toolbar>
        <RouterLink to="/" className={classes.container}>
          <Avatar alt="Logo" src={LogoImg} className={classes.logo} />
          <Typography className={classes.title} component="span" variant="h3">
            Lanchos
          </Typography>
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
          <IconButton color="inherit">
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;

import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import LogoImg from 'assets/images/logo.svg';

type Props = {
  mobileMenu: boolean;
  changeMobileMenu: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
    },
    logo: {
      width: 50,
      height: 50,
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
    burger: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }),
);

const DashboardNavbar: FC<Props> = ({ mobileMenu, changeMobileMenu }) => {
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
        {mobileMenu ? (
          <IconButton
            color="inherit"
            onClick={changeMobileMenu}
            className={classes.burger}
          >
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton
            color="inherit"
            onClick={changeMobileMenu}
            className={classes.burger}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;

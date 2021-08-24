import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import LogoImg from '../../../logo.svg';

const styleBlock = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
};

const styleLogo = {
  width: '40px',
  height: '40px',
};

const styleHeader = {
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  fontSize: '24px',
  fontWeight: 700,
  color: '#fff',
  marginLeft: '8px',
  textDeraration: 'none',
};

const DashboardNavbar: FC = () => (
  <AppBar elevation={0}>
    <Toolbar>
      <RouterLink to="/" style={styleBlock}>
        <img alt="Logo" src={LogoImg} style={styleLogo} />
        <Typography style={styleHeader} component="span" variant="h3">
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

export default DashboardNavbar;

import React, { FC } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import {
  Button,
  ListItem,
  SvgIconTypeMap,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import type { Icon } from 'react-feather';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

interface Props {
  href: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  Icon: Icon | OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  title: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      paddingTop: 5,
      paddingBottom: 5,
    },
    link: {
      fontWeight: 600,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      letterSpacing: 0,
      textTransform: 'none',
      width: '100%',
      color: '#6b778c',
    },
    icon: {
      width: 24,
    },
    text: {
      marginLeft: 6,
    },
  }),
);

const NavItem: FC<Props> = ({ href, Icon, title }) => {
  const location = useLocation();
  const classes = useStyles();

  const active = location.pathname === href;

  return (
    <ListItem disableGutters className={classes.root}>
      <Button
        component={RouterLink}
        className={classes.link}
        style={{
          ...(active && {
            color: '#5664d2',
          }),
        }}
        to={href}
      >
        {Icon && <Icon className={classes.icon} />}
        <span style={{ marginLeft: 6 }}>{title}</span>
      </Button>
    </ListItem>
  );
};

export default NavItem;

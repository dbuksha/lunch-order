import React, { FC } from 'react';
import {
  NavLink as RouterLink,
  matchPath,
  useLocation,
} from 'react-router-dom';
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
    link: {
      fontWeight: 600,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      letterSpacing: 0,
      textTransform: 'none',
      width: '100%',
      color: 'rgb(107, 119, 140)',
      '&$active': {
        fontWeight: 600,
        color: 'rgb(86, 100, 210)',
      },
    },
    active: {},
    text: {
      marginLeft: 6,
    },
  }),
);

const NavItem: FC<Props> = ({ href, Icon, title }) => {
  const location = useLocation();
  const classes = useStyles();

  const active = matchPath(location.pathname, { path: href });

  return (
    <ListItem disableGutters>
      <Button
        component={RouterLink}
        className={classes.link}
        style={{
          ...(active && {
            color: 'rgb(86, 100, 210)',
          }),
        }}
        to={href}
      >
        {Icon && <Icon size="20" />}
        <span style={{ marginLeft: 6 }}>{title}</span>
      </Button>
    </ListItem>
  );
};

export default NavItem;
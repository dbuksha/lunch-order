import React, { FC } from 'react';
import {
  Avatar,
  Box,
  Divider,
  List,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import FastfoodOutlinedIcon from '@material-ui/icons/FastfoodOutlined';
import {
  BarChart as BarChartIcon,
  ShoppingBag as ShoppingBagIcon,
} from 'react-feather';
import NavItem from './NavItem';

// temp data
const user = {
  avatar: 'https://ca.slack-edge.com/T03G61VPV-UL0LZHA6Q-d497cf66f4d9-512',
  jobTitle: 'oleg.babenko@distillery.com',
  name: 'Олег Бабенко',
};

const menuItem = [
  {
    href: '/admin',
    Icon: BarChartIcon,
    title: 'Главная',
  },
  {
    href: '/dishes',
    Icon: FastfoodOutlinedIcon,
    title: 'Список блюд',
  },
  {
    href: '/complex',
    Icon: ShoppingBagIcon,
    title: 'Комплексы',
  },
];

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: 256,
      paddingTop: 64,
    },
    content: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    logo: {
      width: 64,
      height: 64,
    },
  }),
);

const DashboardSidebarContent: FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.content} sx={{ p: 2 }}>
        <Avatar src={user.avatar} className={classes.logo} />
        <Typography color="textPrimary" variant="h5">
          {user.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {menuItem.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              Icon={item.Icon}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
};

export default DashboardSidebarContent;

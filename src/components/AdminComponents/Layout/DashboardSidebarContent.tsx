import React, { FC } from 'react';
import { useSelector } from 'react-redux';
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
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import {
  BarChart as BarChartIcon,
  ShoppingBag as ShoppingBagIcon,
  Bookmark as BookmarkIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
} from 'react-feather';
import { getUserSelector } from 'store/users';
import NavItem from './NavItem';

const menuItem = [
  {
    href: '/admin',
    Icon: BarChartIcon,
    title: 'Главная',
  },
  {
    href: '/admin/dishes',
    Icon: FastfoodOutlinedIcon,
    title: 'Список блюд',
  },
  {
    href: '/admin/complexes',
    Icon: ShoppingBagIcon,
    title: 'Комплексы',
  },
  {
    href: '/admin/orders',
    Icon: BookmarkIcon,
    title: 'Текущие заказы',
  },
  {
    href: '/admin/completed-orders',
    Icon: CheckCircleIcon,
    title: 'Завершенные заказы',
  },
  {
    href: '/admin/history-orders',
    Icon: ClockIcon,
    title: 'История доставок',
  },
  {
    href: '/admin/user-list',
    Icon: AccountCircleOutlinedIcon,
    title: 'Пользователи',
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
    avatar: {
      width: 80,
      height: 80,
      marginBottom: 12,
    },
  }),
);

const DashboardSidebarContent: FC = () => {
  const classes = useStyles();
  const user = useSelector(getUserSelector);

  return (
    <Box className={classes.container}>
      {user ? (
        <Box className={classes.content} sx={{ p: 2 }}>
          {user.avatar ? (
            <Avatar src={user.avatar} className={classes.avatar} />
          ) : null}
          <Typography color="textPrimary" variant="h5">
            {user.name || 'Администратор'}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {user.email || ''}
          </Typography>
        </Box>
      ) : null}
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

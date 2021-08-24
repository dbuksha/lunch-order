import React, { FC } from 'react';
import { Avatar, Box, Divider, List, Typography } from '@material-ui/core';
import FastfoodOutlinedIcon from '@material-ui/icons/FastfoodOutlined';
import { BarChart as BarChartIcon } from 'react-feather';
import NavItem from './NavItem';

const user = {
  avatar: 'https://ca.slack-edge.com/T03G61VPV-UL0LZHA6Q-d497cf66f4d9-512',
  jobTitle: 'oleg.babenko@distillery.com',
  name: 'Олег Бабенко',
};

const items = [
  {
    href: '/dashboard',
    Icon: BarChartIcon,
    title: 'Главная',
  },
  {
    href: '/dishes',
    Icon: FastfoodOutlinedIcon,
    title: 'Список блюд',
  },
];

const DashboardSidebarContent: FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: 256,
      paddingTop: 64,
    }}
  >
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      <Avatar src={user.avatar} style={{ width: 64, height: 64 }} />
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
        {items.map((item) => (
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

export default DashboardSidebarContent;

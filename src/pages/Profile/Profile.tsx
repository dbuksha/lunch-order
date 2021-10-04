import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import AccountBalanceWalletOutlined from '@material-ui/icons/AccountBalanceWalletOutlined';

import { getUserSelector } from 'store/users';

import MainLayout from 'components/SiteLayout/MainLayout';
import Ruble from 'components/Ruble';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: 20,
    },
    link: {
      fontSize: 14,
      textDecoration: 'none',
      color: '#000',
    },
    avatar: {
      width: 90,
      height: 90,
      marginBottom: 16,
    },
    userInfoContainer: {
      maxWidth: 300,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    balance: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 20,
    },
    balanceText: {
      lineHeight: '24px',
      marginLeft: 4,
    },
    userTransactions: {
      width: 600,
      margin: '0 auto',
    },
    row: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    refill: {
      minWidth: 100,
      color: '#3f51b5',
    },
    ordered: {
      minWidth: 100,
      color: '#df5989',
    },
  }),
);

function numberWithSpaces(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const Profile: FC = () => {
  const classes = useStyles();
  const currentUser = useSelector(getUserSelector);

  return (
    <MainLayout>
      <Container className={classes.root}>
        <Box>
          {currentUser ? (
            <Box className={classes.userInfoContainer} sx={{ p: 2 }}>
              {currentUser.avatar ? (
                <Avatar src={currentUser.avatar} className={classes.avatar} />
              ) : null}
              <Typography color="textPrimary" variant="h5">
                {currentUser.name || 'Пользователь'}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {currentUser.email || ''}
              </Typography>
              <Box className={classes.balance}>
                <AccountBalanceWalletOutlined color="primary" />
                <Typography
                  color="textSecondary"
                  variant="body2"
                  className={classes.balanceText}
                >
                  {numberWithSpaces(currentUser.balance) || 0}
                  <Ruble />
                </Typography>
              </Box>
            </Box>
          ) : null}
          <Box className={classes.userTransactions}>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Дата</b>
                    </TableCell>
                    <TableCell>
                      <b>Описание транзакции</b>
                    </TableCell>
                    <TableCell>
                      <b>Сумма</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>4.10.2021</TableCell>
                    <TableCell>
                      <Box>
                        <Typography color="textPrimary" variant="body2">
                          Пополнение баланса
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell className={classes.refill}>
                      <b>
                        + {numberWithSpaces(1000)} <Ruble />
                      </b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3.10.2021</TableCell>
                    <TableCell>
                      Сделан заказ: Витаминный салат, Гречка, Сырный суп, Сырник
                    </TableCell>
                    <TableCell className={classes.ordered}>
                      <b>
                        - {numberWithSpaces(220)} <Ruble />
                      </b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Profile;

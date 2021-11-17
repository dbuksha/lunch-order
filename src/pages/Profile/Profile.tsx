import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
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

import { Transaction } from 'entities/Transaction';

import { getUserSelector } from 'store/users';
import { getTransactions, getTransactionsSelector } from 'store/transactions';

import MainLayout from 'components/SiteLayout/MainLayout';
import Ruble from 'components/Ruble';

import { numberWithSpaces } from '../../utils/orders/calculateDishesPrice';

import SlackIcon from '../../assets/images/slack-logo.svg';

import './profile.scss';

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
      marginBottom: 10,
    },
    paramsContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
    userInfoContainer: {
      maxWidth: 300,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    slackIcon: {
      width: 18,
    },
    balance: {
      display: 'flex',
      justifyContent: 'center',
      marginLeft: 20,
    },
    balanceText: {
      lineHeight: '24px',
      marginLeft: 4,
      color: '#000',
    },
    btnContainer: {
      display: 'flex',
      justifyContent: 'center',
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
    waiting: {
      minWidth: 100,
      color: '#e97a18',
    },
    hidden: {
      display: 'none',
    },
  }),
);

const getSum = (arr: Transaction[], type: string): number => {
  let sum = 0;

  sum = arr.reduce((sum, el) => {
    el.type === type ? (sum += el.summa) : sum;
    return sum;
  }, sum);

  return sum;
};

const Profile: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentUser = useSelector(getUserSelector);
  const transactions = useSelector(getTransactionsSelector);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  return (
    <MainLayout>
      <Container className={classes.root}>
        <Box>
          {currentUser ? (
            <Box className={classes.userInfoContainer}>
              {currentUser.avatar ? (
                <Avatar src={currentUser.avatar} className={classes.avatar} />
              ) : null}
              <Typography color="textPrimary" variant="h5">
                {currentUser.name || 'Пользователь'}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {currentUser.email || ''}
              </Typography>
              <Box className={classes.paramsContainer}>
                {currentUser.slack_id ? (
                  <Box className={classes.balance}>
                    <img
                      src={SlackIcon}
                      alt="slack-logo"
                      className={classes.slackIcon}
                    />
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      className={classes.balanceText}
                    >
                      {currentUser.slack_id}
                    </Typography>
                  </Box>
                ) : null}
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
            </Box>
          ) : null}

          {transactions.length ? (
            <Box className={classes.userTransactions}>
              <Box className={classes.btnContainer}>
                <button
                  className={`btn-filter btn-filter__all ${
                    filterStatus === 'all' ? 'btn-filter__all--active' : ''
                  }`}
                  onClick={() => setFilterStatus('all')}
                >
                  Все
                </button>
                <button
                  className={`btn-filter btn-filter__refill ${
                    filterStatus === 'refill'
                      ? 'btn-filter__refill--active'
                      : ''
                  }`}
                  onClick={() => setFilterStatus('refill')}
                >
                  {`Пополнения Σ = ${numberWithSpaces(
                    getSum(transactions, 'refill'),
                  )}`}
                  <Ruble />
                </button>
                <button
                  className={`btn-filter btn-filter__ordered ${
                    filterStatus === 'ordered'
                      ? 'btn-filter__ordered--active'
                      : ''
                  }`}
                  onClick={() => setFilterStatus('ordered')}
                >
                  {`Траты Σ = ${numberWithSpaces(
                    getSum(transactions, 'ordered'),
                  )}`}
                  <Ruble />
                </button>
                {transactions.some((el) => el.type === 'waiting') ? (
                  <button
                    className={`btn-filter btn-filter__waiting ${
                      filterStatus === 'waiting'
                        ? 'btn-filter__waiting--active'
                        : ''
                    }`}
                    onClick={() => setFilterStatus('waiting')}
                  >
                    {`В ожидании списания Σ = ${numberWithSpaces(
                      getSum(transactions, 'waiting'),
                    )}`}
                    <Ruble />
                  </button>
                ) : null}
              </Box>
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
                    {transactions.map((el: any) => (
                      <TableRow
                        key={el.id}
                        className={
                          filterStatus === 'all' || filterStatus === el.type
                            ? ''
                            : classes.hidden
                        }
                      >
                        <TableCell>
                          {dayjs(el.date).format('DD.MM.YYYY')}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography color="textPrimary" variant="body2">
                              {el.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          className={
                            // eslint-disable-next-line no-nested-ternary
                            el.type === 'refill'
                              ? classes.refill
                              : el.type === 'ordered'
                              ? classes.ordered
                              : classes.waiting
                          }
                        >
                          <b>
                            {`${
                              el.type === 'refill' ? '+' : '-'
                            } ${numberWithSpaces(el.summa)}`}
                            <Ruble />
                          </b>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : null}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Profile;

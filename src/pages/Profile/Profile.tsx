import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  Avatar,
  Box,
  Container,
  Theme,
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

import { fetchUserInfo, getUserSelector } from 'store/users';
import { getTransactions, getTransactionsSelector } from 'store/transactions';
import { getDepositModeSelector } from 'store/settings';

import MainLayout from 'components/SiteLayout/MainLayout';
import Ruble from 'components/Ruble';

import { formatCurrency } from '../../utils/orders/calculateDishesPrice';
import { colors } from '../../utils/colors';

import SlackIcon from '../../assets/images/slack-logo.svg';

const useStyles = makeStyles((theme: Theme) =>
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
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    row: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    refill: {
      minWidth: 100,
      color: colors.blue,
    },
    ordered: {
      minWidth: 100,
      color: colors.lightRed,
    },
    waiting: {
      minWidth: 100,
      color: colors.orange,
    },
    btnFilter: {
      padding: '4px 8px',
      marginRight: 12,
      transition: 'all .25s ease-in-out',
      background: 'transparent',
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: 'solid',
      cursor: 'pointer',
    },
    grayBtn: {
      color: 'gray',
      borderColor: 'gray',
      '&:hover': {
        color: '#fff',
        background: 'gray',
      },
    },
    grayBtnActive: {
      color: '#fff',
      background: 'gray',
    },
    refillBtn: {
      color: colors.blue,
      borderColor: colors.blue,
      '&:hover': {
        color: '#fff',
        background: colors.blue,
      },
    },
    refillBtnActive: {
      color: '#fff',
      background: colors.blue,
    },
    orderedBtn: {
      color: colors.lightRed,
      borderColor: colors.lightRed,
      '&:hover': {
        color: '#fff',
        background: colors.lightRed,
      },
    },
    orderedBtnActive: {
      color: '#fff',
      background: colors.lightRed,
    },
    waitingBtn: {
      color: colors.orange,
      borderColor: colors.orange,
      '&:hover': {
        color: '#fff',
        background: colors.orange,
      },
    },
    waitingBtnActive: {
      color: '#fff',
      background: colors.orange,
    },
    hidden: {
      display: 'none',
    },
  }),
);

const getSum = (arr: Transaction[], type: string): number => {
  let sum = 0;

  sum = arr.reduce((sum, el) => {
    el.type === type ? (sum += el.amount) : sum;
    return sum;
  }, sum);

  return sum;
};

const Profile: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentUser = useSelector(getUserSelector);
  const depositMode = useSelector(getDepositModeSelector);
  const transactions = useSelector(getTransactionsSelector);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchUserInfo(currentUser!.email!));
    dispatch(getTransactions());
  }, [dispatch]);

  if (!depositMode) {
    window.location.href = '/';
  }

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
              {depositMode ? (
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
                      {formatCurrency(currentUser.balance) || 0}
                      <Ruble />
                    </Typography>
                  </Box>
                </Box>
              ) : null}
            </Box>
          ) : null}

          {transactions.length ? (
            <Box className={classes.userTransactions}>
              <Box className={classes.btnContainer}>
                <button
                  onClick={() => setFilterStatus('all')}
                  className={[
                    classes.btnFilter,
                    classes.grayBtn,
                    filterStatus === 'all' ? classes.grayBtnActive : '',
                  ].join(' ')}
                >
                  Все
                </button>
                {transactions.some((el) => el.type === 'refill') ? (
                  <button
                    onClick={() => setFilterStatus('refill')}
                    className={[
                      classes.btnFilter,
                      classes.refillBtn,
                      filterStatus === 'refill' ? classes.refillBtnActive : '',
                    ].join(' ')}
                  >
                    {`Пополнения Σ = ${formatCurrency(
                      getSum(transactions, 'refill'),
                    )}`}
                    <Ruble />
                  </button>
                ) : null}
                {transactions.some((el) => el.type === 'ordered') ? (
                  <button
                    onClick={() => setFilterStatus('ordered')}
                    className={[
                      classes.btnFilter,
                      classes.orderedBtn,
                      filterStatus === 'ordered'
                        ? classes.orderedBtnActive
                        : '',
                    ].join(' ')}
                  >
                    {`Траты Σ = ${formatCurrency(
                      getSum(transactions, 'ordered'),
                    )}`}
                    <Ruble />
                  </button>
                ) : null}
                {transactions.some((el) => el.type === 'waiting') ? (
                  <button
                    onClick={() => setFilterStatus('waiting')}
                    className={[
                      classes.btnFilter,
                      classes.waitingBtn,
                      filterStatus === 'waiting'
                        ? classes.waitingBtnActive
                        : '',
                    ].join(' ')}
                  >
                    {`В ожидании списания Σ = ${formatCurrency(
                      getSum(transactions, 'waiting'),
                    )}`}
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
                            } ${formatCurrency(el.amount)}`}
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

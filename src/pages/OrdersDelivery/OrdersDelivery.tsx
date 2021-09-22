import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  Table,
  TableBody,
  TableRow,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { getIsLoading } from 'store/app';
import { fetchAllUsers, getAllUserSelector } from 'store/users';

import MainLayout from 'components/SiteLayout/MainLayout';
import Ruble from 'components/Ruble';
import DeliveryItem from './DeliveryItem';

import { useGroupedDishes } from './useGroupedDishes';
import { usePreparedDeliveryData } from './usePreparedDeliveryData';
import { useCalculatedDeliveryPrice } from './useCalculatedDeliveryPrice';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: 600,
      margin: '30px auto',
    },
    caption: {
      fontSize: 16,
      color: '#000',
    },
    alert: {
      margin: '20px auto',
    },
  }),
);

const OrdersDelivery: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isLoading = useSelector(getIsLoading);
  const gropedDishes = useGroupedDishes();
  const deliveryPrice = useCalculatedDeliveryPrice(gropedDishes);
  const deliveryData = usePreparedDeliveryData(gropedDishes);
  const users = useSelector(getAllUserSelector);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [payer, setPayer] = useState('default');
  const [dialogStatus, setDialogStatus] = useState('');

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch]);

  if (!deliveryData.length && !isLoading) {
    return (
      <MainLayout>
        <Alert variant="outlined" severity="info" className={classes.alert}>
          На сегодня еще нет заказов.
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <TableContainer component={Paper} className={classes.root}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <b>Заказы</b>
              </TableCell>
              <TableCell align="right">
                <b>Кол-во</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryData?.map((deliveryItem) => (
              <DeliveryItem
                name={deliveryItem.name}
                quantity={deliveryItem.quantity}
                key={deliveryItem.name}
              />
            ))}
            <TableRow>
              <TableCell align="left" colSpan={3}>
                <b className={classes.caption}>
                  Итого: {deliveryPrice}
                  <Ruble />
                </b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </MainLayout>
  );
};

export default OrdersDelivery;

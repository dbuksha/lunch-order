import React, { FC } from 'react';
import { useSelector } from 'react-redux';
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
import Ruble from 'components/Ruble';

import MainLayout from 'components/SiteLayout/MainLayout';
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
      color: '#000',
    },
    alert: {
      margin: '20px auto',
    },
  }),
);

const OrdersDelivery: FC = () => {
  const classes = useStyles();
  const isLoading = useSelector(getIsLoading);
  const gropedDishes = useGroupedDishes();
  const deliveryPrice = useCalculatedDeliveryPrice(gropedDishes);
  const deliveryData = usePreparedDeliveryData(gropedDishes);

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
          <caption>
            {' '}
            <b className={classes.caption}>
              Итого: {deliveryPrice}
              <Ruble />
            </b>
          </caption>
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
          </TableBody>
        </Table>
      </TableContainer>
    </MainLayout>
  );
};

export default OrdersDelivery;

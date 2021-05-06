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
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { getIsLoading } from 'store/app';
import Ruble from 'components/Ruble';

import DeliveryItem from './DeliveryItem';
import { useGroupedDishes } from './useGroupedDishes';
import { usePreparedDeliveryData } from './usePreparedDeliveryData';
import { useCalculatedDeliveryPrice } from './useCalculatedDeliveryPrice';

const OrdersDelivery: FC = () => {
  const isLoading = useSelector(getIsLoading);
  const gropedDishes = useGroupedDishes();
  const deliveryPrice = useCalculatedDeliveryPrice(gropedDishes);
  const deliveryData = usePreparedDeliveryData(gropedDishes);

  if (!deliveryData.length && !isLoading) {
    return (
      <Alert variant="outlined" severity="info">
        На сегодня еще нет заказов.
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <caption>
          {' '}
          Итого: {deliveryPrice}
          <Ruble />
        </caption>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} align="right">
              Кол-во
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
  );
};

export default OrdersDelivery;

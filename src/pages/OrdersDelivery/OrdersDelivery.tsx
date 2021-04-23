import React, { FC } from 'react';
import {
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  Table,
  TableBody,
  TableRow,
} from '@material-ui/core';
import DeliveryItem from './DeliveryItem';
import { useGroupedDishes } from './useGroupedDishes';
import { usePreparedDeliveryData } from './usePreparedDeliveryData';
import { useCalculatedDeliveryPrice } from './useCalculatedDeliveryPrice';

const OrdersDelivery: FC = () => {
  const gropedDishes = useGroupedDishes();
  const deliveryPrice = useCalculatedDeliveryPrice(gropedDishes);
  const deliveryData = usePreparedDeliveryData(gropedDishes);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <caption> Итого: {deliveryPrice}&#8381;</caption>
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

import React, { FC } from 'react';
import { TableCell } from '@material-ui/core';
import { Dish } from 'entities/Dish';

type OrderDishItemProps = {
  dish: Dish;
  quantity: number;
};
const OrderDishItem: FC<OrderDishItemProps> = ({ dish, quantity }) => {
  return (
    <>
      <TableCell component="th" scope="row">
        {dish.name}
      </TableCell>
      <TableCell align="right">{dish.price}&#8381;</TableCell>
      <TableCell align="right">{quantity}</TableCell>
    </>
  );
};

export default OrderDishItem;

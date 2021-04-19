import React, { FC } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import { Dish } from 'entities/Dish';

type DeliveryItemProps = {
  quantity: number;
  dish: Dish;
};
const DeliveryItem: FC<DeliveryItemProps> = ({ dish, quantity }) => {
  return (
    <TableRow key={dish.id}>
      <TableCell component="th" scope="row">
        {dish.name}
      </TableCell>
      <TableCell align="right">{dish.price}&#8381;</TableCell>
      <TableCell align="right">{quantity}</TableCell>
    </TableRow>
  );
};

export default DeliveryItem;

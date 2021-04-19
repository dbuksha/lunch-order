import React, { FC } from 'react';
import { TableCell, TableRow } from '@material-ui/core';

export type DeliveryItemProps = {
  name: string;
  quantity: number;
};

const DeliveryItem: FC<DeliveryItemProps> = ({ name, quantity }) => {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
      <TableCell align="right">{quantity}</TableCell>
    </TableRow>
  );
};

export default DeliveryItem;

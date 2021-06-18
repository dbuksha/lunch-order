import React, { FC } from 'react';
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Chip,
} from '@material-ui/core';
import { calculateOrderPrice } from 'utils/orders';

import { Order } from 'entities/Order';
import OrderDishItem from 'pages/OrdersList/OrderDishItem';
import Ruble from 'components/Ruble';
import dayjs from 'utils/dayjs';

type OrderCardProps = {
  order: Order;
};
const useStyles = makeStyles({
  tableCell: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.54)',
  },
  table: {
    width: '100%',
  },
  justifySpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});
const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const classes = useStyles();

  const isTodayOrder = dayjs(order.date).day() === dayjs().day();
  const calculatedDishesPrice = calculateOrderPrice(order.dishes);
  const colorMode = isTodayOrder ? 'primary' : 'default';
  const dayLabel = isTodayOrder ? 'Сегодня' : 'Завтра';

  return (
    <Paper>
      <Toolbar className={classes.justifySpaceBetween}>
        <Typography component="div" variant="subtitle1">
          {order.person!.name}
        </Typography>
        <Chip label={dayLabel} color={colorMode} />
      </Toolbar>
      <TableContainer>
        <Table className={classes.table} size="small">
          <caption>
            {' '}
            Итого: {calculatedDishesPrice}
            <Ruble />
          </caption>
          <TableHead>
            <TableRow>
              <TableCell
                className={classes.tableCell}
                align="right"
                colSpan={2}
              >
                Стоимость
              </TableCell>
              <TableCell className={classes.tableCell} align="right">
                Кол-во
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.dishes.map(({ dish, quantity }) => (
              <TableRow key={dish.id}>
                <OrderDishItem dish={dish} quantity={quantity} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
export default OrderCard;

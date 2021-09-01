import React, { FC } from 'react';
import {
  Avatar,
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
  Box,
} from '@material-ui/core';
import { calculateDishesPrice } from 'utils/orders';
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
  justifyFlexStart: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
});
const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const classes = useStyles();

  const isTodayOrder = dayjs(order.date).day() === dayjs().day();

  console.log(order);

  return (
    <Paper>
      <Toolbar className={classes.justifySpaceBetween}>
        {/* <Box className={classes.justifyFlexStart}>
          {order.person!.avatar ? (
            <Avatar src={order.person!.avatar} className={classes.avatar} />
          ) : null}
          <Typography component="div" variant="subtitle1">
            {order.person!.name}
          </Typography>
        </Box> */}
        <Chip
          label={isTodayOrder ? 'Сегодня' : 'Завтра'}
          color={isTodayOrder ? 'primary' : 'default'}
        />
      </Toolbar>
      <TableContainer>
        <Table className={classes.table} size="small">
          <caption>
            {' '}
            Итого: {calculateDishesPrice(order.dishes.map((d) => d.dish))}
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

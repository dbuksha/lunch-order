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
} from '@material-ui/core';
import { calculateDishesPrice } from 'utils/orders';
import { Order } from 'entities/Order';
import OrderDishItem from 'pages/OrdersList/OrderDishItem';

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
});
const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const classes = useStyles();

  return (
    <Paper>
      <Toolbar>
        <Typography component="div" variant="subtitle1">
          {order.person!.name}
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table className={classes.table} size="small">
          <caption>
            {' '}
            Итого: {calculateDishesPrice(order.dishes.map((d) => d.dish))}
            &#8381;
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

import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { fetchOrders } from 'store/orders';
import { Dish, OrderDish } from 'entities/Dish';
import {
  Paper,
  Typography,
  TableContainer,
  TableHead,
  TableCell,
  Table,
  TableBody,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { chain } from 'lodash';
import { calculateDishesPrice } from 'utils/orders';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const OrdersDelivery: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const [deliveryDishes, setDeliveryDishes] = useState<OrderDish[]>([]);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // TODO: count lunches
  useEffect(() => {
    if (!orders.length) return;
    const dishes = orders.flatMap((o) => o.dishes);

    const result = chain(dishes)
      .groupBy((d) => d.dish.id)
      .map((value) => {
        const size = value.reduce((acc: number, dish: OrderDish) => {
          acc += dish.quantity;
          return acc;
        }, 0);

        return { dish: value[0].dish, quantity: size };
      })
      .value();
    console.log('==========');

    setDeliveryDishes(result);
    console.log(result);

    // calculate and set delivery price
    const price = result.reduce((acc: number, dish: OrderDish) => {
      const dishesPrice = dish.dish.price * dish.quantity;
      acc += dishesPrice;
      return acc;
    }, 0);

    console.log(price);
    setDeliveryPrice(price);
  }, [orders]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <caption> Итого: {deliveryPrice}&#8381;</caption>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="right">
                Цена
              </TableCell>
              <TableCell align="right">Кол-во</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryDishes?.map(({ dish, quantity }) => (
              <TableRow key={dish.id}>
                <TableCell component="th" scope="row">
                  {dish.name}
                </TableCell>
                <TableCell align="right">{dish.price}&#8381;</TableCell>
                <TableCell align="right">{quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrdersDelivery;

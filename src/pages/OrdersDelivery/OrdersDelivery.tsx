import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { minBy } from 'lodash';
import { fetchOrders } from 'store/orders';
import { Dish, OrderDish } from 'entities/Dish';
import { useTodayLunches } from 'use/useTodayLunches';
import {
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  Table,
  TableBody,
  TableRow,
} from '@material-ui/core';
import {
  calculateDeliveryPrice,
  calculateDishesQuantity,
  getLunchDishesAndIds,
  removeDishesWithLunchQuantity,
  subtractLunchQuantityFromDish,
} from './collectDeliveryDataHelper';
import DeliveryItem, { DeliveryItemProps } from './DeliveryItem';

const OrdersDelivery: FC = () => {
  const dispatch = useDispatch();
  const [todayNumber, lunches] = useTodayLunches();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [deliveryData, setDeliveryData] = useState<DeliveryItemProps[]>([]);

  // load order
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // collect table data
  // TODO: separate set price and set table data to the different
  useEffect(() => {
    if (!orders.length) return;
    const dishes = orders.flatMap((o) => o.dishes);
    if (!dishes.length) return;
    const deliveryDataMap: Map<string, DeliveryItemProps> = new Map();

    // calculate quantity of each order dishes
    let calculatedDishes = calculateDishesQuantity(dishes);
    // calculate and set delivery price
    const finalPrice = calculateDeliveryPrice(calculatedDishes);

    // collect full lunches from groupedOrders
    lunches.forEach((lunch) => {
      const [lunchDishes, lunchDishesIds] = getLunchDishesAndIds(
        calculatedDishes,
        lunch.dishes,
      );

      // get full lunch quantity
      const minQuantityDish = minBy<OrderDish>(lunchDishes, (d) => d.quantity);
      if (!minQuantityDish) return;
      const fullLunchQuantity = minQuantityDish.quantity;

      // add calculated lunches to the table data
      deliveryDataMap.set(lunch.name, {
        name: lunch.name,
        quantity: fullLunchQuantity,
      });

      calculatedDishes = removeDishesWithLunchQuantity(
        calculatedDishes,
        lunchDishes,
        fullLunchQuantity,
      );

      // subtract lunch quantity from dish quantity (if lunch has this dish)
      calculatedDishes = subtractLunchQuantityFromDish(
        calculatedDishes,
        lunchDishesIds,
        fullLunchQuantity,
      );
    });

    // add leftovers dishes to the table data
    calculatedDishes.forEach(({ dish, quantity }) => {
      deliveryDataMap.set(dish.name, {
        name: dish.name,
        quantity,
      });
    });

    // set price and table data
    setDeliveryData([...deliveryDataMap.values()]);
    setDeliveryPrice(finalPrice);
  }, [orders]);

  return (
    <>
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
    </>
  );
};

export default OrdersDelivery;

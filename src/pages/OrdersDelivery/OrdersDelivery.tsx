import React, { FC, useEffect, useState } from 'react';
import { minBy } from 'lodash';
import { OrderDish } from 'entities/Dish';
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
import * as deliveryDataHelper from './collectDeliveryDataHelper';
import DeliveryItem, { DeliveryItemProps } from './DeliveryItem';
import { useCalculateDeliveryDishes } from './useCalculatedDeliveryDishes';

const OrdersDelivery: FC = () => {
  const lunches = useTodayLunches();
  const calculatedDishes = useCalculateDeliveryDishes();
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [deliveryData, setDeliveryData] = useState<DeliveryItemProps[]>([]);

  // set delivery price
  useEffect(() => {
    if (!calculatedDishes.length) return;
    setDeliveryPrice(
      deliveryDataHelper.calculateDeliveryPrice(calculatedDishes),
    );
  }, [calculatedDishes]);

  // collect table data
  useEffect(() => {
    if (!calculatedDishes.length) return;
    const deliveryDataMap: Map<string, DeliveryItemProps> = new Map();
    let deliveryDataStart: OrderDish[] = JSON.parse(
      JSON.stringify(calculatedDishes),
    );

    // collect full lunches from groupedDishes
    lunches.forEach((lunch) => {
      const [
        lunchDishes,
        lunchDishesIds,
      ] = deliveryDataHelper.getLunchDishesAndIds(
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

      deliveryDataStart = deliveryDataHelper.removeDishesWithLunchQuantity(
        deliveryDataStart,
        lunchDishes,
        fullLunchQuantity,
      );

      // subtract lunch quantity from dish quantity (if lunch has this dish)
      deliveryDataStart = deliveryDataHelper.subtractLunchQuantityFromDish(
        deliveryDataStart,
        lunchDishesIds,
        fullLunchQuantity,
      );
    });

    // add leftovers dishes to the table data
    deliveryDataStart.forEach(({ dish, quantity }) => {
      deliveryDataMap.set(dish.name, {
        name: dish.name,
        quantity,
      });
    });

    // set price and table data
    setDeliveryData([...deliveryDataMap.values()]);
  }, [calculatedDishes]);

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

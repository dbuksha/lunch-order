import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { clearOrdersList, fetchOrders, getTodayOrders } from 'store/orders';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';
import { OrderDish } from 'entities/Dish';

export const useGroupedDishes = (): OrderDish[] => {
  const dispatch = useDispatch();
  const orders = useSelector(getTodayOrders);
  const [calculatedDishes, setCalculatedDishes] = useState<OrderDish[]>([]);

  // load order
  useEffect(() => {
    dispatch(fetchOrders());
    return () => {
      dispatch(clearOrdersList());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!orders.length) return;
    const dishes = orders.flatMap((o) => o.dishes);
    if (!dishes.length) return;
    setCalculatedDishes(deliveryDataHelper.calculateDishesQuantity(dishes));
  }, [orders]);

  return calculatedDishes;
};

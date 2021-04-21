import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { useEffect, useState } from 'react';
import { clearOrdersList, fetchOrders } from 'store/orders';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';
import { OrderDish } from 'entities/Dish';

export const useCalculateDeliveryDishes = (): OrderDish[] => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const [calculatedDishes, setCalculatedDishes] = useState<OrderDish[]>([]);

  // load order
  useEffect(() => {
    dispatch(fetchOrders());
    return () => {
      dispatch(clearOrdersList());
    };
  }, [dispatch]);

  // TODO: set dishes after dispatch
  // set calculatedDishes
  useEffect(() => {
    if (!orders.length) return;
    const dishes = orders.flatMap((o) => o.dishes);
    if (!dishes.length) return;
    setCalculatedDishes(deliveryDataHelper.calculateDishesQuantity(dishes));
  }, [orders]);

  return calculatedDishes;
};

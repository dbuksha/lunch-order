import { useEffect, useState } from 'react';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';
import { OrderDish } from 'entities/Dish';

export const useCalculatedDeliveryPrice = (
  calculatedDishes: OrderDish[],
): number => {
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  useEffect(() => {
    if (!calculatedDishes.length) return;
    setDeliveryPrice(
      deliveryDataHelper.calculateDeliveryPrice(calculatedDishes),
    );
  }, [calculatedDishes]);

  return deliveryPrice;
};

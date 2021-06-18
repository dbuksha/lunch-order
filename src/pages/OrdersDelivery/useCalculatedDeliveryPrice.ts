import { useEffect, useState } from 'react';

import { OrderDish } from 'entities/Dish';
import { calculateOrderPrice } from 'utils/orders';

export const useCalculatedDeliveryPrice = (
  calculatedDishes: OrderDish[],
): number => {
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  useEffect(() => {
    if (!calculatedDishes.length) return;
    setDeliveryPrice(calculateOrderPrice(calculatedDishes));
  }, [calculatedDishes]);

  return deliveryPrice;
};

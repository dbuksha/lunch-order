// collect table data
import { useEffect, useState } from 'react';
import { OrderDish } from 'entities/Dish';
import { DeliveryItemProps } from 'pages/OrdersDelivery/DeliveryItem';

export const usePreparedDeliveryData = (
  calculatedDishes: OrderDish[],
): DeliveryItemProps[] => {
  const [deliveryData, setDeliveryData] = useState<DeliveryItemProps[]>([]);

  useEffect(() => {
    if (!calculatedDishes.length) return;
    const deliveryDataMap: Map<string, DeliveryItemProps> = new Map();
    const deliveryDataStart: OrderDish[] = JSON.parse(
      JSON.stringify(calculatedDishes),
    );

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

  return deliveryData;
};

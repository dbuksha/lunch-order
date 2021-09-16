// collect table data
import { useEffect, useState } from 'react';
import { OrderDish } from 'entities/Dish';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';
import { minBy } from 'lodash';
import { DeliveryItemProps } from 'pages/OrdersDelivery/DeliveryItem';
import { useTodayLunches } from 'use/useTodayLunches';

export const usePreparedDeliveryData = (
  calculatedDishes: OrderDish[],
): DeliveryItemProps[] => {
  const lunches = useTodayLunches(false);
  const [deliveryData, setDeliveryData] = useState<DeliveryItemProps[]>([]);

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
      ] = deliveryDataHelper.filterDishesAndIdsFromOrderDishesByLunch(
        calculatedDishes,
        lunch.dishes,
      );

      // skip handling lunch if we don't have full lunch set in delivery
      const isFullExist = deliveryDataHelper.isFullLunchExist(
        lunch.dishes,
        deliveryDataStart,
      );
      if (!isFullExist) return;

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
  }, [calculatedDishes, lunches]);

  return deliveryData;
};

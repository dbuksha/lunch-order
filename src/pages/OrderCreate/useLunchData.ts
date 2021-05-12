import { useState } from 'react';
import { calculateDishesPrice } from 'utils/orders';
import { Dish, SelectedDishes } from 'entities/Dish';
import { intersection } from 'lodash';

const getSelectedLunchDishes = (
  selectedDishes: SelectedDishes,
  lunchDishesIds: string[],
): SelectedDishes => {
  const selectedLunchDishes = intersection<string>(
    [...selectedDishes.keys()],
    lunchDishesIds,
  );

  return new Map(
    [...selectedDishes].filter(([k, v]) => selectedLunchDishes.indexOf(k) > -1),
  );
};

const getMinLunchQuantity = (
  lunchDishesIds: string[],
  selectedDishes: SelectedDishes,
) => {
  const isFullSelected = lunchDishesIds.every(
    (id) => [...selectedDishes.keys()].indexOf(id) > -1,
  );
  if (!isFullSelected) return 0;

  const filteredLunchDishes = getSelectedLunchDishes(
    selectedDishes,
    lunchDishesIds,
  );
  return Math.min(...filteredLunchDishes.values());
};

export const useLunchData = (
  dishes: Dish[],
  selectedDishes: SelectedDishes,
) => {
  const [lunchPrice] = useState<number>(() => calculateDishesPrice(dishes));
  const minLunchQuantity = getMinLunchQuantity(
    dishes.map((d) => d.id),
    selectedDishes,
  );

  return {
    lunchPrice,
    minLunchQuantity,
  };
};

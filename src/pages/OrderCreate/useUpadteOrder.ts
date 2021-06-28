import { useDispatch } from 'react-redux';

import { Dish } from 'entities/Dish';
import { Lunch } from 'entities/Lunch';
import {
  updateDishesQuantity,
  updateOrder,
  UpdateQuantityAction,
} from 'store/orders';

const findLunchById = (lunches: Lunch[], lunchId: string): Lunch | null =>
  lunches.find((lunch: Lunch) => lunch.id === lunchId) || null;

export const useUpdateOrder = (todayLunches: Lunch[]) => {
  const dispatch = useDispatch();

  const onDishSelect = (
    lunchId: string,
    selected: boolean,
    quantity: number,
    dish?: Dish,
  ) => {
    let dishes = [];
    if (!dish) {
      const selectedLunch = findLunchById(todayLunches, lunchId);
      if (!selectedLunch) return;
      dishes = selectedLunch.dishes;
    } else {
      dishes = [dish];
    }

    dispatch(updateOrder({ dishes, selected, quantity }));
  };

  const onChangeDishQuantity = (
    lunchId: string,
    type: UpdateQuantityAction,
    dish?: Dish,
  ) => {
    let dishes = [];
    if (!dish) {
      const selectedLunch = findLunchById(todayLunches, lunchId);
      if (!selectedLunch) return;
      dishes = selectedLunch.dishes;
    } else {
      dishes = [dish];
    }

    dispatch(updateDishesQuantity({ dishes, type }));
  };

  return { onChangeDishQuantity, onDishSelect };
};

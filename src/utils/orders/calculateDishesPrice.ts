import { Dish } from 'entities/Dish';

export const calculateDishesPrice = (dishes: Dish[]): number => {
  if (!dishes.length) return 0;

  return dishes.reduce(
    (accum: number, current: Dish) => accum + current.price,
    0,
  );
};

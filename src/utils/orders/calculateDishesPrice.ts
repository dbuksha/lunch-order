import { Dish, OrderDish } from 'entities/Dish';

export const calculateDishesPrice = (dishes: Dish[]): number => {
  if (!dishes.length) return 0;

  return dishes.reduce(
    (accum: number, current: Dish) => accum + current.price,
    0,
  );
};

/**
 * Calculate delivery price depending on the dishes quantity
 */
export const calculateOrderPrice = (dishes: OrderDish[]): number => {
  return dishes.reduce((acc: number, dish: OrderDish) => {
    const dishesPrice = dish.dish.price * dish.quantity;
    acc += dishesPrice;
    return acc;
  }, 0);
};

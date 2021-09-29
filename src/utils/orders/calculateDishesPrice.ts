import { Dish, OrderDish } from 'entities/Dish';

export const calculateDishesPrice = (dishes: Dish[]): number => {
  if (!dishes.length) return 0;

  return dishes.reduce((sum: number, current: Dish) => sum + current.price, 0);
};

export const calculatePriceCard = (dishes: OrderDish[]): number => {
  if (!dishes.length) return 0;

  return dishes.reduce(
    (sum: number, current: OrderDish) =>
      sum + current.dish.price * current.quantity,
    0,
  );
};

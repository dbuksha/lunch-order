import { Dish, OrderDish } from 'entities/Dish';
import { chain, intersectionBy } from 'lodash';

export const getLunchDishesAndIds = (
  orderDishes: OrderDish[],
  dishes: Dish[],
): [OrderDish[], string[]] => {
  const preparedDishesToIntersection = orderDishes.map((d) => ({
    ...d,
    id: d.dish.id,
  }));
  const lunchDishes = intersectionBy<OrderDish, Dish>(
    preparedDishesToIntersection,
    dishes,
    'id',
  );
  const lunchDishesIds = lunchDishes.map((d) => d.dish.id);

  return [lunchDishes, lunchDishesIds];
};

export const calculateDishesQuantity = (dishes: OrderDish[]): any[] => {
  return chain(dishes)
    .groupBy((d) => d.dish.id)
    .map((value) => {
      const size = value.reduce((acc: number, dish: OrderDish) => {
        acc += dish.quantity;
        return acc;
      }, 0);

      return { dish: value[0].dish, quantity: size };
    })
    .value();
};

export const calculateDeliveryPrice = (dishes: OrderDish[]): number => {
  return dishes.reduce((acc: number, dish: OrderDish) => {
    const dishesPrice = dish.dish.price * dish.quantity;
    acc += dishesPrice;
    return acc;
  }, 0);
};

export const removeDishesWithLunchQuantity = (
  dishes: OrderDish[],
  lunchDishes: OrderDish[],
  quantity: number,
): OrderDish[] => {
  const dishesToRemove = lunchDishes.filter((d) => d.quantity === quantity);
  if (!dishesToRemove.length) return dishes;

  const dishesIdsToRemove = dishesToRemove.map((d) => d.id);
  return dishes.filter(({ dish }) => dishesIdsToRemove.indexOf(dish.id) === -1);
};

export const subtractLunchQuantityFromDish = (
  dishes: OrderDish[],
  lunchDishesIds: string[],
  quantity: number,
): OrderDish[] => {
  return dishes.map((d) => {
    if (lunchDishesIds.indexOf(d.dish.id) > -1) {
      d = { ...d, quantity: d.quantity - quantity };
    }
    return d;
  });
};

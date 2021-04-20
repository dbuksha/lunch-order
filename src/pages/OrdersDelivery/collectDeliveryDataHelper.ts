import { Dish, OrderDish } from 'entities/Dish';
import { chain, intersectionBy } from 'lodash';

/**
 *  Filter dishes from order delivery dishes by lunch dishes ids
 */
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

/**
 * Calculate every dish quantity in delivery
 */
export const calculateDishesQuantity = (dishes: OrderDish[]): OrderDish[] => {
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

/**
 * Calculate delivery price depending on the dishes quantity
 */
export const calculateDeliveryPrice = (dishes: OrderDish[]): number => {
  return dishes.reduce((acc: number, dish: OrderDish) => {
    const dishesPrice = dish.dish.price * dish.quantity;
    acc += dishesPrice;
    return acc;
  }, 0);
};

/**
 * Remove dishes in delivery data if they have the same quantity, as lunch
 *
 * @param dishes: all delivery dishes
 * @param lunchDishes: dishes, which are included in lunch
 * @param quantity - quantity of lunch in order delivery
 */
export const removeDishesWithLunchQuantity = (
  dishes: OrderDish[],
  lunchDishes: OrderDish[],
  quantity: number,
): OrderDish[] => {
  const dishesToRemove = lunchDishes.filter((d) => d.quantity === quantity);
  if (!dishesToRemove.length) return dishes;

  const dishesIdsToRemove = dishesToRemove.map(({ dish }) => dish.id);
  return dishes.filter(({ dish }) => dishesIdsToRemove.indexOf(dish.id) === -1);
};

/**
 * Reduce dishes quantity in delivery data if they are in lunch
 */
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

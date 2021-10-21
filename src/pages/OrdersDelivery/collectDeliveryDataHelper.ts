import { Dish, OrderDish } from 'entities/Dish';
import { chain, intersectionBy } from 'lodash';

/**
 *  Return filtered dishes from order delivery dishes by lunch dishes ids
 */
export const filterDishesAndIdsFromOrderDishesByLunch = (
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
 *
 * @param lunchDishes - dishes in lunch
 * @param dishes - order delivery dishes
 *
 * Check if we have full lunch set in order delivery
 */
export const isFullLunchExist = (
  lunchDishes: Dish[],
  dishes: OrderDish[],
): boolean => {
  const dishesIds = dishes.map((d) => d.dish.id);
  const lunchDishesIds = lunchDishes.map((d) => d.id);

  return lunchDishesIds.every((id) => dishesIds.indexOf(id) > -1);
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

      const users = value.map((el) => el.userID) as string[];

      return { dish: value[0].dish, quantity: size, users };
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
  // console.log(dishes, lunchDishes, quantity);
  const dishesToRemove = lunchDishes.filter((d) => d.quantity === quantity);
  if (!dishesToRemove.length) return dishes;

  const dishesIdsToRemove = dishesToRemove.map(({ dish }) => dish.id);

  // console.log(
  //   'после удаления - ',
  //   dishes.filter(({ dish }) => dishesIdsToRemove.indexOf(dish.id) === -1),
  // );
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
  // console.log('qwerty = ', dishes);
  return dishes.map((d) => {
    if (lunchDishesIds.indexOf(d.dish.id) > -1) {
      // console.log('dish - ', d);
      d = { ...d, quantity: d.quantity - quantity };
    }
    return d;
  });
};

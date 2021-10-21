import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { clearOrdersList, fetchOrders, getTodayOrders } from 'store/orders';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';
import { OrderDish } from 'entities/Dish';
import { useTodayLunches } from 'use/useTodayLunches';

export const useGroupedDishes = (): OrderDish[] => {
  const dispatch = useDispatch();
  const orders = useSelector(getTodayOrders);
  const lunches = useTodayLunches(false);
  const [calculatedDishes, setCalculatedDishes] = useState<OrderDish[]>([]);

  // console.log('orders today = ', orders);
  // console.log('lunchList today = ', lunches);

  // load order
  useEffect(() => {
    dispatch(fetchOrders());
    return () => {
      dispatch(clearOrdersList());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!orders.length) return;

    const tempDishes = orders.map((el) => {
      const temp = {
        id: el.id,
        dishesWithUser: el.dishes.map((item) => {
          return {
            ...item,
            userID: el.person?.id as string,
          };
        }),
      };

      return temp;
    });

    const dishes = tempDishes.flatMap((o) => o.dishesWithUser);
    if (!dishes.length) return;

    // testing
    const garnirArr = dishes.filter((el) => el.dish.category === 'side');

    const mainArr = dishes.filter((el) => el.dish.category === 'main');

    const otherArr = dishes.filter(
      (el) => el.dish.category !== 'main' && el.dish.category !== 'side',
    );

    const garnirDontPair: OrderDish[] = [];
    const mainDontPair: OrderDish[] = [];

    const garnirIndexArr: number[] = [];
    const mainIndexArr: number[] = [];

    const couple: string[] = [];

    garnirArr.forEach((garnir, ind) => {
      mainArr.forEach((main, key) => {
        if (garnir.userID === main.userID) {
          couple.push(`${garnir.dish.name} + ${main.dish.name}`);

          garnirIndexArr.push(ind);
          mainIndexArr.push(key);
        }
      });
    });

    const uniq: any[] = [];

    function checkExist(name: string, arr: any[]) {
      // console.log(name, arr);
      let flag = false;

      if (!arr.length) {
        return false;
      }

      arr.forEach((el) => {
        if (el.name === name) {
          flag = true;
        }
      });

      return flag;
    }

    couple.forEach((name) => {
      let counter = 0;

      couple.forEach((el) => {
        if (el === name) {
          counter += 1;
        }
      });

      if (!checkExist(name, uniq)) {
        uniq.push({ name, quantity: counter });
      }
    });

    garnirArr.forEach((el, ind) => {
      let flag = false;

      garnirIndexArr.forEach((index) => {
        if (ind === index) {
          flag = true;
        }
      });

      if (!flag) {
        garnirDontPair.push(el);
        otherArr.push(el);
      }
    });

    mainArr.forEach((el, ind) => {
      let flag = false;

      mainIndexArr.forEach((index) => {
        if (ind === index) {
          flag = true;
        }
      });

      if (!flag) {
        mainDontPair.push(el);
        otherArr.push(el);
      }
    });

    // console.log('dishes = ', dishes);
    // console.log('otherArr | uniq = ', otherArr, uniq);

    console.log([
      ...uniq,
      ...deliveryDataHelper.calculateDishesQuantity(otherArr),
    ]);

    setCalculatedDishes([
      ...deliveryDataHelper.calculateDishesQuantity(otherArr),
    ]);
  }, [orders]);

  return calculatedDishes;
};

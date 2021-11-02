import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { clearOrdersList, fetchOrders, getTodayOrders } from 'store/orders';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';
import { OrderDish } from 'entities/Dish';

// Проверка пары на уникальность
const checkUnique = (currentEl: OrderDish, arr: OrderDish[]): boolean => {
  const result = arr.filter((el) => el.dish.id === currentEl.dish.id);

  return Boolean(result.length);
};

// выбираем лишние блюда
const selectExtraDishes = (dishArr: OrderDish[], dishIndexArr: number[]) => {
  const selectExtra = dishArr.filter((el, ind) => {
    const result = dishIndexArr.find((index) => ind === index);

    return result === undefined;
  });

  return selectExtra;
};

// преобразование к списку, в котором только единичные блюда
const singleDishList = (dishes: OrderDish[]) => {
  const oneMoreDish: OrderDish[] = [];

  const mainDishes = dishes.map((el) => {
    const tempEl = { ...el };

    if (tempEl.quantity > 1) {
      while (tempEl.quantity > 1) {
        oneMoreDish.push({ ...tempEl, quantity: 1, status: false });
        tempEl.quantity -= 1;
      }
    }

    tempEl.status = false;

    return tempEl;
  });

  return [...mainDishes, ...oneMoreDish];
};

// подсчет кол-ва пар гарнир + главное блюдо
const countUniquePair = (pairArr: OrderDish[]) => {
  const unique: OrderDish[] = [];

  pairArr.forEach((el) => {
    let counter = 0;

    pairArr.forEach((item) => {
      if (el.dish.id === item.dish.id) {
        counter += 1;
      }
    });

    if (!checkUnique(el, unique)) {
      unique.push({ ...el, quantity: counter });
    }
  });

  return unique;
};

export const useGroupedDishes = (): OrderDish[] => {
  const dispatch = useDispatch();
  const orders = useSelector(getTodayOrders);
  const [calculatedDishes, setCalculatedDishes] = useState<OrderDish[]>([]);

  // load order
  useEffect(() => {
    dispatch(fetchOrders());
    return () => {
      dispatch(clearOrdersList());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!orders.length) return;

    // добавление в список принадлежности блюда к пользователю
    const tempDishes = orders.map((el) => {
      const temp = {
        id: el.id,
        personalizedDishes: el.dishes.map((item) => {
          return {
            ...item,
            userID: el.person?.id as string,
          };
        }),
      };

      return temp;
    });

    const result = tempDishes.flatMap((o) => o.personalizedDishes);

    if (!result.length) return;

    const dishesOneByOne = singleDishList(result);

    // выбираем гарниры
    const sideArr = dishesOneByOne.filter((el) => el.dish.category === 'side');

    // выбираем главные блюда
    const mainArr = dishesOneByOne.filter((el) => el.dish.category === 'main');

    // все блюда - гарниры - главные
    const otherArr = dishesOneByOne.filter(
      (el) => el.dish.category !== 'main' && el.dish.category !== 'side',
    );

    const sideIndexArr: number[] = [];
    const mainIndexArr: number[] = [];

    const fullCouples: OrderDish[] = [];

    // выбираем пару: гарнир + главное блюдо
    sideArr.forEach((side, ind) => {
      mainArr.forEach((main, key) => {
        if (side.userID === main.userID && !side.status && !main.status) {
          fullCouples.push({
            dish: {
              id: `${side.dish.id}_${main.dish.id}`,
              name: `${side.dish.name} + ${main.dish.name}`,
              price: side.dish.price + main.dish.price,
              weight: side.dish.weight + main.dish.weight,
            },
            quantity: 1,
            users: [side.userID] as string[],
          });

          side.status = true;
          main.status = true;

          sideIndexArr.push(ind);
          mainIndexArr.push(key);
        }
      });
    });

    // подсчет кол-ва пар гарнир + главное блюдо
    const uniquePair: OrderDish[] = countUniquePair(fullCouples);

    // выбираем лишние гарниры и главные блюда
    const sideUnpaired: OrderDish[] = selectExtraDishes(sideArr, sideIndexArr);
    const mainUnpaired: OrderDish[] = selectExtraDishes(mainArr, mainIndexArr);

    setCalculatedDishes([
      ...uniquePair,
      ...deliveryDataHelper.calculateDishesQuantity([
        ...mainUnpaired,
        ...sideUnpaired,
        ...otherArr,
      ]),
    ]);
  }, [orders]);

  return calculatedDishes;
};

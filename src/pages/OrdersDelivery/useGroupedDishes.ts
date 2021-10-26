import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { clearOrdersList, fetchOrders, getTodayOrders } from 'store/orders';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';
import { OrderDish } from 'entities/Dish';

// Проверка пары на уникальность
const checkUnique = (currentEl: OrderDish, arr: OrderDish[]): boolean => {
  let flag = false;

  if (!arr.length) {
    return false;
  }

  arr.forEach((el) => {
    if (el.dish.id === currentEl.dish.id) {
      flag = true;
    }
  });

  return flag;
};

// выбираем лишние блюда
const selectExtraDishes = (dishArr: OrderDish[], dishIndexArr: number[]) => {
  const selectExtra: OrderDish[] = [];

  dishArr.forEach((el, ind) => {
    let flag = false;

    dishIndexArr.forEach((index) => {
      if (ind === index) {
        flag = true;
      }
    });

    if (!flag) {
      selectExtra.push(el);
    }
  });

  return selectExtra;
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
        dishesWithUser: el.dishes.map((item) => {
          return {
            ...item,
            userID: el.person?.id as string,
          };
        }),
      };

      return temp;
    });

    const result = tempDishes.flatMap((o) => o.dishesWithUser);

    if (!result.length) return;

    const addDish: OrderDish[] = [];

    // преобразование списка к списку, в котором только единичные блюда
    const mainDishes = result.map((el) => {
      Object.defineProperty(el, 'quantity', {
        writable: true,
      });
      if (el.quantity > 1) {
        while (el.quantity > 1) {
          addDish.push({ ...el, quantity: 1, status: false });
          el.quantity -= 1;
        }
      }

      el.status = false;

      return el;
    });

    const dishes = [...mainDishes, ...addDish];

    // выбираем гарниры
    const garnirArr = dishes.filter((el) => el.dish.category === 'side');

    // выбираем главные блюда
    const mainArr = dishes.filter((el) => el.dish.category === 'main');

    // все блюда - гарниры - главные
    const otherArr = dishes.filter(
      (el) => el.dish.category !== 'main' && el.dish.category !== 'side',
    );

    const garnirIndexArr: number[] = [];
    const mainIndexArr: number[] = [];

    const fullCouples: OrderDish[] = [];
    const unique: any[] = [];

    // выбираем пару: гарнир + главное блюдо
    garnirArr.forEach((garnir, ind) => {
      mainArr.forEach((main, key) => {
        if (garnir.userID === main.userID && !garnir.status && !main.status) {
          fullCouples.push({
            dish: {
              id: `${garnir.dish.id}_${main.dish.id}`,
              name: `${garnir.dish.name} + ${main.dish.name}`,
              price: garnir.dish.price + main.dish.price,
              weight: garnir.dish.weight + main.dish.weight,
            },
            quantity: 1,
            users: [garnir.userID] as string[],
          });

          garnir.status = true;
          main.status = true;

          garnirIndexArr.push(ind);
          mainIndexArr.push(key);
        }
      });
    });

    // подсчет кол-ва пар гарнир + главное блюдо
    fullCouples.forEach((el) => {
      let counter = 0;

      fullCouples.forEach((item) => {
        if (el.dish.id === item.dish.id) {
          counter += 1;
        }
      });

      if (!checkUnique(el, unique)) {
        unique.push({ ...el, quantity: counter });
      }
    });

    // выбираем лишние гарниры и главные блюда
    const garnirDontPair: OrderDish[] = selectExtraDishes(
      garnirArr,
      garnirIndexArr,
    );
    const mainDontPair: OrderDish[] = selectExtraDishes(mainArr, mainIndexArr);

    setCalculatedDishes([
      ...unique,
      ...deliveryDataHelper.calculateDishesQuantity([
        ...mainDontPair,
        ...garnirDontPair,
        ...otherArr,
      ]),
    ]);
  }, [orders]);

  return calculatedDishes;
};

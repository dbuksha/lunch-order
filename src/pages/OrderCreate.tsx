import React, { FC, useEffect, useState } from 'react';
import { Grid, Button, Typography, ListSubheader } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';

import firebaseInstance, { Collections } from 'utils/firebase';
// store
import { RootState } from 'store';
// import { calculatedOrderPriceSelector } from 'store/orders/orders-selectors';
import { addOrder, getUserOrder } from 'store/orders';

import { calculateDishesPrice } from 'utils/orders';

// components
import ListDishes from 'components/orders/List-Dishes';
// entities
import { Lunch, LunchState } from 'entities/Lunch';
import { OrderFirebase } from 'entities/Order';
import { Dish } from '../entities/Dish';

type DocumentData = firebase.firestore.DocumentData;
type DocumentReference<T> = firebase.firestore.DocumentReference<T>;

// FIXME: get tomorrow menu when the time is over
const dayNumber = new Date().getDay();

const toggleDishesSelection = (
  dishes: Dish[],
  selected: boolean,
  dishId?: string,
): Dish[] => {
  return dishes.map((dish: Dish) =>
    !dishId || dishId === dish.id ? { ...dish, selected } : dish,
  );
};

const findLunchById = (lunches: Lunch[], lunchId: string): Lunch | null =>
  lunches.find((lunch: Lunch) => lunch.id === lunchId) || null;

const OrderCreate: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );
  const dishesSelector = useSelector((state: RootState) => state.dishes.dishes);
  const order = useSelector((state: RootState) => state.orders.currentOrder);
  const lunches = useSelector((state: RootState) =>
    state.lunches.lunches.filter((l) => l.dayNumber === dayNumber),
  );
  // FIXME: what we need to do if we have no user?
  // TODO: fix type for selected
  const [preparedSelectedDishes, setPreparedSelectedDishes] = useState<
    Lunch[] | null
  >(null);

  // FIXME: calculated price
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  useEffect(() => {
    dispatch(getUserOrder());
  }, [dispatch]);

  // FIXME: depths
  // calls twice
  useEffect(() => {
    if (order) {
      const selected = order.dishes.map((d) => d.id);

      const prepOrder: Lunch[] = lunches.map((lunch: LunchState) => {
        const dishes: Dish[] = lunch.dishes.map((i: string) => ({
          ...dishesSelector[i],
          selected: selected.indexOf(i) > -1,
        }));
        return { ...lunch, dishes };
      });

      setPreparedSelectedDishes(prepOrder);
    }
    ``;
  }, [order, dishesSelector]);

  // recalculate order sum
  useEffect(() => {
    if (preparedSelectedDishes) {
      const selectedDishes = preparedSelectedDishes
        .flatMap((l) => l.dishes)
        .filter((d) => d.selected);
      setCalculatedPrice(calculateDishesPrice(selectedDishes));
    }
    // FIXME: complex dep
  }, [JSON.stringify(preparedSelectedDishes)]);

  // updateSelectedLunches(
  //   state: LunchesState,
  //   {
  //     payload: { lunchId, selected, dishId },
  //   }: PayloadAction<{ lunchId: string; selected: boolean; dishId?: string }>,
  // ) {
  //   // ? do not do like that. Use lodash _.deepClone
  //   const lunches = cloneDeep(state.lunches);
  //   const selectedLunch = lunches.find(
  //     (lunch: Lunch) => lunch.id === lunchId,
  //   );
  //   if (!selectedLunch) return;
  //
  //   selectedLunch.dishes = selectedLunch.dishes.map((dish: Dish) =>
  //     !dishId || dishId === dish.id ? { ...dish, selected } : dish,
  //   );
  //
  //   state.lunches = lunches;
  // },

  // TODO: add updating order
  const onCreateOrderSubmit = async () => {
    return null;
    // if (!currentUser) return;

    // const preparedDishes = selectedDishes.map((d) => ({
    //   dishRef: firebaseInstance.doc(`${Collections.Dishes}/${d.id}`),
    //   quantity: 1, // TODO: add quantity selection to the form
    // }));

    // const order: OrderFirebase = {
    //   date: firebase.firestore.Timestamp.fromDate(new Date()),
    //   dishes: preparedDishes,
    //   person: firebaseInstance.doc(`${Collections.Users}/${currentUser.id}`),
    // };

    // TODO: Send prepared order!

    // try {
    //   await dispatch(addOrder(order));
    //   history.push('/');
    // } catch (e) {
    //   // TODO: handle an error
    //   console.log(e);
    // }
  };

  const onDishSelect = (
    lunchId: string,
    selected: boolean,
    dishId?: string,
  ) => {
    if (!preparedSelectedDishes) return;
    const orderToUpdate: Lunch[] = [...preparedSelectedDishes];
    // FIXME: Do I need write the type here?
    const selectedLunch = findLunchById(orderToUpdate, lunchId);
    if (!selectedLunch) return;

    selectedLunch.dishes = toggleDishesSelection(
      selectedLunch.dishes,
      selected,
      dishId,
    );

    setPreparedSelectedDishes(orderToUpdate);
  };

  return (
    <Grid container spacing={2}>
      {preparedSelectedDishes &&
        preparedSelectedDishes.map((lunch: Lunch) => (
          <Grid item xs={12} sm={6} key={lunch.name}>
            <ListSubheader component="div">{lunch.name}</ListSubheader>
            <ListDishes
              key={lunch.name}
              dishes={lunch.dishes}
              selectDish={(selected, dishId) =>
                onDishSelect(lunch.id, selected, dishId)
              }
            />
          </Grid>
        ))}
      <Typography component="h6" variant="h5">
        Общая стоимость заказа: {calculatedPrice}&#8381;
      </Typography>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={!calculatedPrice}
        onClick={onCreateOrderSubmit}
      >
        {order ? 'Обновить заказ' : 'Заказать'}
      </Button>
    </Grid>
  );
};

export default OrderCreate;

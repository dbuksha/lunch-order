import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
  DocumentReference,
  DocumentData,
} from 'utils/firebase';
// store
import { showLoader, hideLoader, showSnackBar, StatusTypes } from 'store/app';
import { UsersState } from 'store/users';
// entities
import { Transaction } from 'entities/Transaction';
import { OrderFirebase } from 'entities/Order';

import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';
import { DishesState } from 'store/dishes';
import dayjs from 'dayjs';

enum ActionTypes {
  GET_TRANSACTIONS = 'transactions/getTransactions',
}

const collectionRefill = firebaseInstance.collection(Collections.Refill);
const collectionOrders = firebaseInstance.collection(Collections.Orders);

export const getTransactions = createAsyncThunk(
  ActionTypes.GET_TRANSACTIONS,
  async (_, { getState, dispatch }) => {
    const {
      users: { currentUser },
      dishes: { dishesMap },
    } = getState() as {
      users: UsersState;
      dishes: DishesState;
    };

    // FIXME: should I show an error message?
    if (!currentUser) return [];

    dispatch(showLoader());

    const refillResult = await collectionRefill
      .where(
        'user',
        '==',
        firebaseInstance.doc(`${Collections.Users}/${currentUser.id}`),
      )
      .get();

    const ordersResult = await collectionOrders
      .where(
        'person',
        '==',
        firebaseInstance.doc(`${Collections.Users}/${currentUser.id}`),
      )
      .get();

    dispatch(hideLoader());

    const refills = getCollectionEntries<Transaction>(refillResult).map(
      ({ ...refill }) => {
        return {
          ...refill,
          type: 'refill',
          description: 'Пополнение баланса',
          date: refill.date.toMillis(),
        };
      },
    );

    const orders = getCollectionEntries<OrderFirebase>(ordersResult).map(
      ({ ...order }) => {
        const dishesList = order.dishes.map(({ quantity, dishRef }) => ({
          quantity,
          dish: dishesMap[dishRef.id],
        }));
        return {
          ...order,
          type: 'ordered',
          description: `Сделан заказ: ${dishesList.map(
            (el) => ` ${el.dish.name}`,
          )}`,
          date: order.date.toMillis(),
          summa: deliveryDataHelper.calculateDeliveryPrice(dishesList),
        };
      },
    );

    if (!refills.length && !orders.length) return [];

    const joinOperations = [...refills, ...orders];

    const transactions = joinOperations.map((el) => {
      const temp: any = {
        id: el.id,
        date: el.date,
        type: el.type,
        description: el.description,
        summa: el.summa,
      };

      return temp;
    });

    transactions.sort((a, b) =>
      dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1,
    );

    return transactions.reverse();
  },
);

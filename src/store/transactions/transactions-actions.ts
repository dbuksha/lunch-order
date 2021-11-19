import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
// store
import { showLoader, hideLoader } from 'store/app';
import { UsersState } from 'store/users';
import { SettingsState } from 'store/settings';
// entities
import { Transaction } from 'entities/Transaction';
import { OrderFirebase } from 'entities/Order';
import { DeliveryData } from 'entities/Delivery';

import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';
import { DishesState } from 'store/dishes';
import dayjs from 'dayjs';
import { getStatusOfTransaction } from '../../utils/time-helper';

enum ActionTypes {
  GET_TRANSACTIONS = 'transactions/getTransactions',
}

const collectionRefill = firebaseInstance.collection(Collections.Refill);
const collectionDelivery = firebaseInstance.collection(Collections.Delivery);

export const getTransactions = createAsyncThunk(
  ActionTypes.GET_TRANSACTIONS,
  async (_, { getState, dispatch }) => {
    const {
      users: { currentUser },
      dishes: { dishesMap },
      settings: { deposit },
    } = getState() as {
      users: UsersState;
      dishes: DishesState;
      settings: SettingsState;
    };

    const collectionOrders = firebaseInstance.collection(
      deposit ? 'orders_deposit' : 'orders',
    );

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

    const deliveryResult = await collectionDelivery
      .orderBy('createDate', 'desc')
      .limit(1)
      .get();

    const deliveryLast = getCollectionEntries<DeliveryData>(deliveryResult);

    const deliveryDate = deliveryLast[0].createDate.toMillis();

    const deliveryToday =
      dayjs(deliveryDate).format('DD/MM/YYYY') === dayjs().format('DD/MM/YYYY');

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
          type: getStatusOfTransaction(order.date.toMillis(), deliveryToday),
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

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
  async (userID: string | null, { getState, dispatch }) => {
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

    const resultUserID = userID || currentUser.id;

    dispatch(showLoader());

    const refillResult = collectionRefill
      .where(
        'user',
        '==',
        firebaseInstance.doc(`${Collections.Users}/${resultUserID}`),
      )
      .get();

    const ordersResult = collectionOrders
      .where(
        'person',
        '==',
        firebaseInstance.doc(`${Collections.Users}/${resultUserID}`),
      )
      .get();

    const deliveryResult = collectionDelivery
      .orderBy('createDate', 'desc')
      .limit(1)
      .get();

    return Promise.all([refillResult, ordersResult, deliveryResult])
      .then((data) => {
        // работа с доставкой
        const deliveryLast = getCollectionEntries<DeliveryData>(data[2]);
        const deliveryDate = deliveryLast[0].createDate.toMillis();
        const deliveryToday =
          dayjs(deliveryDate).format('DD/MM/YYYY') ===
          dayjs().format('DD/MM/YYYY');

        // работа с пополнениями
        const refills = getCollectionEntries<Transaction>(data[0]).map(
          ({ ...refill }) => {
            return {
              ...refill,
              type: 'refill',
              description: 'Пополнение баланса',
              date: refill.date.toMillis(),
            };
          },
        );

        // работа с заказами (траты и ожидания списания)
        const orders = getCollectionEntries<OrderFirebase>(data[1]).map(
          ({ ...order }) => {
            const dishesList = order.dishes.map(({ quantity, dishRef }) => ({
              quantity,
              dish: dishesMap[dishRef.id],
            }));
            return {
              ...order,
              type: getStatusOfTransaction(
                order.date.toMillis(),
                deliveryToday,
              ),
              description: `Сделан заказ: ${dishesList.map(
                (el) =>
                  ` ${el.dish.name}${
                    el.quantity === 1 ? '' : ` - ${el.quantity}`
                  }`,
              )}`,
              date: order.date.toMillis(),
              amount: deliveryDataHelper.calculateDeliveryPrice(dishesList),
            };
          },
        );

        dispatch(hideLoader());

        if (!refills.length && !orders.length) return [];

        const joinOperations = [...refills, ...orders];

        const transactions = joinOperations.map((el) => {
          const temp: any = {
            id: el.id,
            date: el.date,
            type: el.type,
            description: el.description,
            amount: el.amount,
          };

          return temp;
        });

        transactions.sort((a, b) =>
          dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1,
        );

        return transactions.reverse();
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  },
);

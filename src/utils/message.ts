import { Order } from 'entities/Order';
import { UserNew } from 'entities/User';
import { calculatePriceCard } from './orders';

export const getMessage = (
  userID: string,
  totalSum: number,
  orders: Order[],
  users: UserNew[],
  depositMode: boolean,
): string => {
  let message = '';

  const user = users.find((el: UserNew) => el.id === userID);

  let ordersStr = '';

  orders.forEach((el: Order) => {
    ordersStr += `${el.person!.name}${
      el.person!.slack_id ? ` (<@${el.person!.slack_id}>)` : ''
    } - ${calculatePriceCard(el.dishes)}руб.\n`;
  });

  message += `Обед заказан :cool_doge: \nВсего получилось - ${totalSum}руб.:\n${ordersStr}`;
  message += depositMode
    ? `Деньги за обед отдает >>> ${user!.name || 'Пользователь неизвестен'}.`
    : `Деньги за обед отдаем/переводим (желательно наличными) >>> ${
        user!.name || 'Пользователь неизвестен'
      }.`;

  return message;
};

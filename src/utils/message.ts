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

  const ordersStr = orders.reduce((strAcc: string, el: Order) => {
    const slackUser = el.person!.slack_id ? ` (<@${el.person?.slack_id}>)` : '';
    strAcc += `${el.person!.name}${slackUser} - ${calculatePriceCard(
      el.dishes,
    )}руб.\n`;
    return strAcc;
  }, '');

  message += `Обед заказан :cool_doge: \nВсего получилось - ${totalSum}руб.:\n${ordersStr}`;
  message += depositMode
    ? `Деньги за обед отдает >>> ${user!.name || 'Пользователь неизвестен'}.`
    : `Деньги за обед отдаем/переводим (желательно наличными) >>> ${
        user!.name || 'Пользователь неизвестен'
      }.`;

  return message;
};

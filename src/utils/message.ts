import { Order } from 'entities/Order';
import { UserNew } from 'entities/User';
import { calculatePriceCard } from './orders';

export const getMessage = (
  userID: string,
  totalSum: number,
  orders: Order[],
  users: UserNew[],
): string => {
  let message = '';

  const user = users.find((el: UserNew) => el.id === userID);

  let ordersStr = '';

  orders.forEach((el: any) => {
    ordersStr += `${el.person.name} - ${calculatePriceCard(el.dishes)}руб., `;
  });

  message += `Всего получилось: ${totalSum} руб. `;
  message += ordersStr.slice(0, -2);
  message += ` Деньги за обед отдаем/переводим (желательно наличными) - ${
    user!.name || 'Пользователь неизвестен'
  }.`;

  return message;
};

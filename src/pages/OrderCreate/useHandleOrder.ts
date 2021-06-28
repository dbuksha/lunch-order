import { fetchTodayDelivery } from 'store/deliveries';
import { getOrderDayNumber, isTimeForTodayLunch } from 'utils/time-helper';
import { showSnackBar, StatusTypes } from 'store/app';
import firebaseInstance from 'utils/firebase/firebase-init';
import { Collections } from 'utils/firebase';
import dayjs from 'dayjs';
import { Order, OrderFirebase } from 'entities/Order';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from 'store/users';
import { getTodayDelivery } from 'store/deliveries/deliveries-selectors';
import { Lunch } from 'entities/Lunch';
import { SelectedDishes } from 'entities/Dish';
import { addOrder, deleteOrder } from 'store/orders';
import { useHistory } from 'react-router-dom';
import { User } from 'entities/User';

type UseHandleOrderReturnType = {
  onCreateOrderSubmit: () => void;
  onDeleteOrder: () => void;
};

const collectOrderData = (
  selectedDishes: SelectedDishes,
  currentUser: User,
  order: Order,
) => {
  const preparedDishes: any[] = [];

  selectedDishes.forEach((quantity, id) => {
    preparedDishes.push({
      dishRef: firebaseInstance.doc(`${Collections.Dishes}/${id}`),
      quantity,
    });
  });

  // if lunch not for today or today lunch is already ordered: set tomorrow (8 a.m.)
  const time = isTimeForTodayLunch()
    ? dayjs().hour(8).startOf('h')
    : dayjs().add(1, 'day').hour(8).startOf('h');

  const orderData: OrderFirebase = {
    date: firebase.firestore.Timestamp.fromDate(time.toDate()),
    dishes: preparedDishes,
    person: firebaseInstance.doc(`${Collections.Users}/${currentUser.id}`),
  };

  if (order) orderData.id = order.id;

  return orderData;
};

export const useHandleOrder = (
  selectedDishes: SelectedDishes,
  todayLunches: Lunch[],
  order: Order,
): UseHandleOrderReturnType => {
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);
  const todayDelivery = useSelector(getTodayDelivery);
  const history = useHistory();

  const onCreateOrderSubmit = async () => {
    // TODO: show an error popup
    if (!currentUser || !selectedDishes) return;
    // get updated delivery
    await dispatch(fetchTodayDelivery());
    const isOrderDay = getOrderDayNumber() === todayLunches[0].dayNumber;

    if (!isOrderDay) {
      dispatch(
        showSnackBar({
          status: StatusTypes.warning,
          message:
            'Время истекло, заказ этого меню не может быть создан. Перезагрузите страницу и попробуйте еще раз.',
        }),
      );
      return;
    }

    if (isTimeForTodayLunch() && todayDelivery && isOrderDay) {
      dispatch(
        showSnackBar({
          status: StatusTypes.warning,
          message:
            'Заказ доставки на сегодня уже был сделан. Перезагрузите страницу и попробуйте еще раз.',
        }),
      );
      return;
    }

    const orderData = collectOrderData(selectedDishes, currentUser, order);

    try {
      await dispatch(addOrder(orderData));
      history.push('/');
    } catch (e) {
      // TODO: handle an error
      console.log(e);
    }
  };

  // TODO: show alerts
  const onDeleteOrder = () => {
    async function handleDeleteOrder() {
      if (order?.id) {
        await dispatch(deleteOrder(order.id));
        history.push('/');
      }
    }

    handleDeleteOrder();
  };

  return { onCreateOrderSubmit, onDeleteOrder };
};

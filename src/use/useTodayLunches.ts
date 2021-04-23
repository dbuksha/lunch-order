import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Lunch } from 'entities/Lunch';
import { getOrderDayNumber } from 'utils/time-helper';
import dayjs from 'utils/dayjs';

export const useTodayLunches = (isCreateOrder = true): Lunch[] => {
  const orderDay = isCreateOrder ? getOrderDayNumber() : dayjs().day();
  const lunches = useSelector((state: RootState) =>
    state.lunches.lunches.filter((l) => l.dayNumber === orderDay),
  );

  return lunches;
};

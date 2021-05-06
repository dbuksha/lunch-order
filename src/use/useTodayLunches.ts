import { useSelector } from 'react-redux';
import { sortBy } from 'lodash';
import { Lunch } from 'entities/Lunch';
import { getOrderDayNumber } from 'utils/time-helper';
import dayjs from 'utils/dayjs';
import { getLunches } from 'store/lunches/lunches-selectors';
import { useState } from 'react';

export const useTodayLunches = (isCreateOrder = true): Lunch[] => {
  const orderDay = isCreateOrder ? getOrderDayNumber() : dayjs().day();
  const lunches = useSelector(getLunches);
  const [todayLunches] = useState(
    lunches.filter((l) => l.dayNumber === orderDay),
  );

  return sortBy(todayLunches, 'name');
};

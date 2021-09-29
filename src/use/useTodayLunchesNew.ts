import { useState } from 'react';
import { sortBy } from 'lodash';
import { useSelector } from 'react-redux';
import { Lunch } from 'entities/Lunch';
import { getDeliveryInfoSelector } from 'store/delivery';
import { getLunches } from 'store/lunches/lunches-selectors';
import { getOrderDayNumberNew } from 'utils/time-helper';

export const useTodayLunchesNew = (): Lunch[] => {
  const deliveryInfo = useSelector(getDeliveryInfoSelector);
  const orderDay = getOrderDayNumberNew(deliveryInfo !== null);
  const lunches = useSelector(getLunches);
  const [todayLunches] = useState(
    lunches.filter((l) => l.dayNumber === orderDay),
  );

  return sortBy(todayLunches, 'name');
};

import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Lunch } from 'entities/Lunch';
import { getOrderDayNumber } from 'utils/time-helper';
import { sortBy } from 'lodash';

export const useTodayLunches = (): Lunch[] => {
  const lunches = useSelector((state: RootState) =>
    state.lunches.lunches.filter((l) => l.dayNumber === getOrderDayNumber()),
  );

  return sortBy(lunches, 'name');
};

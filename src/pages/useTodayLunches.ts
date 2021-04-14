import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { LunchState } from '../entities/Lunch';
import { isTimeForTodayLunch } from '../utils/time-helper';

const today = new Date().getDay();
// what we need to do if sunday
const dayNumber = isTimeForTodayLunch() ? today : today + 1;

export const useTodayLunches = (): LunchState[] => {
  return useSelector((state: RootState) =>
    state.lunches.lunches.filter((l) => l.dayNumber === dayNumber),
  );
};

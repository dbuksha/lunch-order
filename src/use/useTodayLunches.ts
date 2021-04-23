import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Lunch } from 'entities/Lunch';
import { isTimeForTodayLunch } from 'utils/time-helper';
import dayjs from 'utils/dayjs';

export const useTodayLunches = (): Lunch[] => {
  const today = dayjs().day();
  // TODO: check the sunday, saturday
  const dayNumber = isTimeForTodayLunch() ? today : today + 1;

  return useSelector((state: RootState) =>
    state.lunches.lunches.filter((l) => l.dayNumber === dayNumber),
  );
};

import dayjs from 'utils/dayjs';

export const isTimeForTodayLunch = (): boolean => {
  const endLunchOrderTime = dayjs().hour(10).minute(30).second(0);
  return dayjs().isBefore(endLunchOrderTime);
};

export const todayStartOrderTime = dayjs().hour(8).startOf('h');
export const todayEndOrderTime = dayjs().hour(10).minute(30).second(0);

// If today is later then 10:30 return condition of getting tomorrow order otherwise today's order
export const isTodayOrTomorrowOrderExists = (date: number): boolean => {
  const tomorrow = dayjs().add(1, 'd').startOf('d');

  return isTimeForTodayLunch()
    ? dayjs(date).isBetween(todayStartOrderTime, todayEndOrderTime)
    : dayjs(date).isSameOrAfter(tomorrow);
};

export const getOrderDayNumber = (): number => {
  const todayNumber = dayjs().day();
  // skip sunday and saturday
  if ([0, 6].includes(todayNumber)) return 1;
  const dayNumber = isTimeForTodayLunch() ? todayNumber : todayNumber + 1;

  return dayNumber === 6 ? 1 : dayNumber;
};

export const getDaysToAdd = (): number => {
  const today = dayjs();
  const orderDayNumber = getOrderDayNumber();

  if (today.day() === orderDayNumber) return 0;
  if (orderDayNumber === 1) return today.weekday(+7).diff(today, 'day');
  return 1;
};

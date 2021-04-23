import dayjs from 'utils/dayjs';

export const isTimeForTodayLunch = (): boolean => {
  const endLunchOrderTime = dayjs().hour(10).minute(30).second(0);
  return dayjs().isBefore(endLunchOrderTime);
};

export const todayStartOrderTime = dayjs().hour(8).startOf('h');
export const todayEndOrderTime = dayjs().hour(10).minute(30).second(0);

export const weekdaysNames = [
  'пондельник',
  'вторник',
  'среду',
  'четверг',
  'пятницу',
  'суббота',
  'воскресенье',
];

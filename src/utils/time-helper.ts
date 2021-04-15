import dayjs from 'dayjs';

export const isTimeForTodayLunch = (): boolean => {
  const endLunchOrderTime = dayjs().hour(10).minute(30).second(0);
  return dayjs().isBefore(endLunchOrderTime);
};

export const weekdaysNames = [
  'пондельник',
  'вторник',
  'среду',
  'четверг',
  'пятницу',
  'субботу',
  'воскресенье',
];

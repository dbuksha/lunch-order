export const isTimeForTodayLunch = (): boolean => {
  const currentDate = Date.now();
  const endLunchOrderTime = new Date().setHours(10, 30, 0, 0);
  return currentDate < endLunchOrderTime;
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

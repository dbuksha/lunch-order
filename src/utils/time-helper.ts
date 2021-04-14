export const isTimeForTodayLunch = (): boolean => {
  const currentDate = Date.now();
  // FIXME: DO NOT PUSH 22! it's need to be 10:30
  const endLunchOrderTime = new Date().setHours(10, 30, 0, 0);
  return currentDate < endLunchOrderTime;
};

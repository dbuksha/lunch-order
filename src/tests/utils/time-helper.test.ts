import MockDate from 'mockdate';
import dayjs from 'utils/dayjs';
import {
  isTimeForTodayLunch,
  isTodayOrTomorrowOrderExists,
  getOrderDayNumber,
  getDaysToAdd,
} from 'utils/time-helper';

describe('isTimeForTodayLunch', () => {
  it('should return false for 12:00', () => {
    MockDate.set(dayjs().hour(12).startOf('h').valueOf());
    expect(isTimeForTodayLunch()).toBeFalsy();
  });

  it('should return true for 10:00', () => {
    MockDate.set(dayjs().hour(10).startOf('h').valueOf());
    expect(isTimeForTodayLunch()).toBeTruthy();
  });
});

describe('isTodayOrTomorrowOrderExists', () => {
  it('should return false for yesterday order', () => {
    const yesterday = dayjs().subtract(1, 'd').valueOf();
    expect(isTodayOrTomorrowOrderExists(yesterday)).toBeFalsy();
  });

  it('should return true for today in time order', () => {
    const time = dayjs().hour(9).startOf('h').valueOf();
    MockDate.set(time);

    expect(isTodayOrTomorrowOrderExists(time)).toBeTruthy();
  });

  it('should return true for tomorrow order', () => {
    const time = dayjs().hour(12).startOf('h');
    MockDate.set(time.valueOf());
    const tomorrow = time.add(1, 'd');

    expect(isTodayOrTomorrowOrderExists(tomorrow.valueOf())).toBeTruthy();
  });
});

describe('getOrderDayNumber', () => {
  it('should return Friday if we have Friday before 10:30', () => {
    const time = dayjs().day(5).hour(9).startOf('h');
    MockDate.set(time.valueOf());

    expect(getOrderDayNumber()).toBe(5);
  });

  it('should return Monday if we have Friday after 10:30', () => {
    const time = dayjs().day(5).hour(12).startOf('h');
    MockDate.set(time.valueOf());

    expect(getOrderDayNumber()).toBe(1);
  });

  it('should return Monday if we have Saturday', () => {
    const time = dayjs().day(6).hour(10).startOf('h');
    MockDate.set(time.valueOf());

    expect(getOrderDayNumber()).toBe(1);
  });

  it('should return Monday if we have Sunday', () => {
    const time = dayjs().day(7).hour(10).startOf('h');
    MockDate.set(time.valueOf());

    expect(getOrderDayNumber()).toBe(1);
  });
});

describe('getDaysToAdd', () => {
  it('should return 0 for Friday before 10:30', () => {
    const time = dayjs().day(5).hour(9).startOf('h');
    MockDate.set(time.valueOf());

    expect(getDaysToAdd()).toBe(0);
  });

  it('should return 3 for Friday after 10:30', () => {
    const time = dayjs().day(5).hour(12).startOf('h');
    MockDate.set(time.valueOf());

    expect(getDaysToAdd()).toBe(3);
  });

  it('should return 2 for Saturday', () => {
    const time = dayjs().day(6).hour(12).startOf('h');
    MockDate.set(time.valueOf());

    expect(getDaysToAdd()).toBe(2);
  });

  it('should return 1 for Sunday', () => {
    const time = dayjs().day(7).hour(12).startOf('h');
    MockDate.set(time.valueOf());

    expect(getDaysToAdd()).toBe(1);
  });
});

import MockDate from 'mockdate';
import {
  isTimeForTodayLunch,
  isTodayOrTomorrowOrderExists,
  getOrderDayNumber,
  getDaysToAdd,
} from 'utils/time-helper';
import dayjs from 'utils/dayjs';

function randomDate() {
  const start = new Date(2012, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

describe('isTimeForTodayLunch check if time before 10:30', () => {
  afterAll(() => {
    MockDate.reset();
  });

  const IsBeforeEndLunchTime = (date: Date) => {
    const now = dayjs(date);
    const endOfLunchTime = now.hour(10).minute(30).second(0);
    return dayjs(date).isBefore(endOfLunchTime);
  };

  const timeCases = Array.from({ length: 50 }, () => {
    const date = randomDate();
    return [date, IsBeforeEndLunchTime(date)];
  });

  test.each(timeCases)('for %s should return %s', (date, expected) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    MockDate.set(dayjs(date).valueOf());
    expect(isTimeForTodayLunch()).toBe(expected);
  });
});

describe('isTodayOrTomorrowOrderExists check if order is created today/tomorrow', () => {
  afterAll(() => {
    MockDate.reset();
  });

  describe('yesterday order', () => {
    it('should return false', () => {
      const yesterday = dayjs().subtract(1, 'd').valueOf();
      expect(isTodayOrTomorrowOrderExists(yesterday)).toBeFalsy();
    });
  });

  describe('today order', () => {
    it('should return true in time', () => {
      const time = dayjs().hour(9).startOf('h').valueOf();
      MockDate.set(time);

      expect(isTodayOrTomorrowOrderExists(time)).toBeTruthy();
    });

    it('should return false later 10:30', () => {
      const time = dayjs().hour(11).startOf('h').valueOf();
      MockDate.set(time);

      expect(isTodayOrTomorrowOrderExists(time)).toBeFalsy();
    });
  });

  describe('tomorrow order', () => {
    it('should return true ', () => {
      const time = dayjs().hour(12).startOf('h');
      MockDate.set(time.valueOf());
      const tomorrow = time.add(1, 'd');

      expect(isTodayOrTomorrowOrderExists(tomorrow.valueOf())).toBeTruthy();
    });
  });
});

describe('getOrderDayNumber get order day to set current menu', () => {
  afterAll(() => {
    MockDate.reset();
  });

  // {day_number: [[current_hour: expected_order_day_number]]}
  const daysCases: { [key: number]: number[][] } = {
    1: [
      [10, 1],
      [11, 2],
    ],
    2: [
      [10, 2],
      [12, 3],
    ],
    3: [
      [10, 3],
      [15, 4],
    ],
    4: [
      [10, 4],
      [14, 5],
    ],
    5: [
      [10, 5],
      [15, 1],
    ],
    6: [
      [10, 1],
      [14, 1],
    ],
    0: [
      [10, 1],
      [14, 1],
    ],
  };

  Object.keys(daysCases).forEach((day) => {
    const todayName = dayjs().locale('en').weekday(Number(day)).format('dddd');

    describe(todayName, () => {
      const cases = daysCases[Number(day)];

      cases.forEach(([time, expectedDay]) => {
        const expectedDayName = dayjs()
          .locale('en')
          .weekday(Number(expectedDay))
          .format('dddd');

        it(`should return ${expectedDayName} at ${time}:00`, () => {
          const today = dayjs().day(Number(day)).hour(time).startOf('h');
          MockDate.set(today.valueOf());

          expect(getOrderDayNumber()).toBe(expectedDay);
        });
      });
    });
  });
});

describe('getDaysToAdd returns needed days count to add for set order date', () => {
  afterAll(() => {
    MockDate.reset();
  });

  // {day_number: [[current_hour: expected_result_days_count]]}
  const daysCases: { [key: number]: number[][] } = {
    1: [
      [10, 0],
      [11, 1],
    ],
    2: [
      [10, 0],
      [12, 1],
    ],
    3: [
      [10, 0],
      [15, 1],
    ],
    4: [
      [10, 0],
      [14, 1],
    ],
    5: [
      [10, 0],
      [15, 3],
    ],
    6: [
      [10, 2],
      [14, 2],
    ],
    0: [
      [10, 1],
      [14, 1],
    ],
  };

  Object.keys(daysCases).forEach((day) => {
    const todayName = dayjs().locale('en').weekday(Number(day)).format('dddd');

    describe(todayName, () => {
      const cases = daysCases[Number(day)];

      cases.forEach(([time, expectedDays]) => {
        it(`should return ${expectedDays} days at ${time}:00`, () => {
          const today = dayjs().day(Number(day)).hour(time).startOf('h');
          MockDate.set(today.valueOf());

          expect(getDaysToAdd()).toBe(expectedDays);
        });
      });
    });
  });
});

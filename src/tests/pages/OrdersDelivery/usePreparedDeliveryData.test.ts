import { usePreparedDeliveryData } from 'pages/OrdersDelivery/usePreparedDeliveryData';
import { renderHook } from '@testing-library/react-hooks';

// mocked data
import mockedData from 'tests/pages/OrdersDelivery/mockedDishesData.json';
import mockTodayLunches from 'tests/pages/OrdersDelivery/mockedTodayLunches.json';

jest.mock('../../../use/useTodayLunches', () => ({
  useTodayLunches: () => mockTodayLunches,
}));

describe('usePreparedDeliveryData', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('empty data passed', () => {
    it('should return empty list', () => {
      const { result } = renderHook(() => usePreparedDeliveryData([]));
      expect(result.current).toEqual([]);
    });
  });

  describe('data passed', () => {
    it('should contain the passed data', () => {
      const list = [
        {
          dish: {
            id: 'Q8oaw60daEOnY5ZNlkbt',
            weight: 150,
            price: 30,
            name: 'Гречка',
          },
          quantity: 1,
        },
      ];

      const { result } = renderHook(() => usePreparedDeliveryData(list));

      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: list[0].dish.name,
            quantity: list[0].quantity,
          }),
        ]),
      );
    });

    it('should collect lunch', () => {
      const { result } = renderHook(() => usePreparedDeliveryData(mockedData));

      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Комплекс 1' }),
        ]),
      );
    });
  });
});

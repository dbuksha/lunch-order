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
    const EXPECTED_NAME = 'Гречка';

    it('should contain the passed data', () => {
      const EXPECTED_QUANTITY = 5;

      const list = [
        {
          dish: {
            id: 'Q8oaw60daEOnY5ZNlkbt',
            weight: 150,
            price: 30,
            name: EXPECTED_NAME,
          },
          quantity: EXPECTED_QUANTITY,
        },
      ];

      const { result } = renderHook(() => usePreparedDeliveryData(list));

      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: EXPECTED_NAME,
            quantity: EXPECTED_QUANTITY,
          }),
        ]),
      );
    });

    it('should collect lunch', () => {
      const LUNCH_NAME = 'Комплекс 1';
      const { result } = renderHook(() => usePreparedDeliveryData(mockedData));

      expect(result.current).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: LUNCH_NAME })]),
      );
    });

    it('should change remove dish from list after collecting lunch', () => {
      const { result } = renderHook(() => usePreparedDeliveryData(mockedData));

      expect(result.current).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: EXPECTED_NAME }),
        ]),
      );
    });

    it('should change quantity of a dish after collecting lunch', () => {
      const DISH_NAME = 'Суп грибной';
      const EXPECTED_UPDATED_QUANTITY = 1;
      const { result } = renderHook(() => usePreparedDeliveryData(mockedData));

      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: DISH_NAME,
            quantity: EXPECTED_UPDATED_QUANTITY,
          }),
        ]),
      );
    });
  });
});

import { usePreparedDeliveryData } from 'pages/OrdersDelivery/usePreparedDeliveryData';
import * as redux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';

// mocked data
import data from 'tests/pages/OrdersDelivery/mockedDishesData.json';
import resultData from 'tests/pages/OrdersDelivery/mockedResultData.json';
import todayLunches from 'tests/pages/OrdersDelivery/mockedTodayLunches.json';

describe('usePreparedDeliveryData', () => {
  it('should return prepared lunches from dinners list', () => {
    const spy = jest.spyOn(redux, 'useSelector');
    spy.mockReturnValue(todayLunches);

    const { result } = renderHook(() => usePreparedDeliveryData(data));

    expect(result.current).toEqual(resultData);
  });
});

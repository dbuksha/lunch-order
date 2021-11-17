import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { getDepositModeSelector } from 'store/settings';

import OrdersDeliveryDeposit from './OrdersDeliveryDeposit';
import OrdersDeliveryWithoutDeposit from './OrdersDeliveryWithoutDeposit';

const OrdersDeliveryMain: FC = () => {
  const depositMode = useSelector(getDepositModeSelector);

  return (
    <>
      {depositMode ? (
        <OrdersDeliveryDeposit />
      ) : (
        <OrdersDeliveryWithoutDeposit />
      )}
    </>
  );
};

export default OrdersDeliveryMain;

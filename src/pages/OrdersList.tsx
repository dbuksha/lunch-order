import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchOrders } from '../store/orders';

const OrdersList: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  return <h1>Hi!, its orders list</h1>;
};

export default OrdersList;

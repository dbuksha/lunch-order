import React, { FC, useEffect } from 'react';

import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import { fetchLunches } from 'store/lunches';
import { fetchDishes } from 'store/dishes';
import { getCurrentUser } from 'store/users';

import StyledLoader from 'components/StyledLoader';
import { fetchTodayDelivery } from 'store/deliveries';

const AuthRoute: FC<RouteProps> = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);
  const isDataPreloaded = useSelector(
    (state: RootState) => state.lunches.isPreloaded,
  );

  useEffect(() => {
    async function preloadData() {
      await dispatch(fetchDishes());
      await dispatch(fetchLunches());
      dispatch(fetchTodayDelivery());
    }

    if (!isDataPreloaded) preloadData();
  }, [dispatch, isDataPreloaded]);

  if (!isDataPreloaded) return <StyledLoader />;

  return (
    <Route
      path={props.path}
      exact={props.exact}
      render={() => (currentUser ? props.children : <Redirect to="/login" />)}
    />
  );
};

export default AuthRoute;

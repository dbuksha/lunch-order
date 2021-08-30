import React, { FC, useEffect } from 'react';

import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import { fetchLunches } from 'store/lunches';
import { fetchDishes } from 'store/dishes';
import { fetchUserInfo } from 'store/users';

import { checkAuth } from 'utils/checkAuth';

import StyledLoader from 'components/StyledLoader';

const AuthRoute: FC<RouteProps> = (props) => {
  const dispatch = useDispatch();
  const isDataPreloaded = useSelector(
    (state: RootState) => state.lunches.isPreloaded,
  );

  useEffect(() => {
    async function preloadData() {
      await dispatch(fetchUserInfo());
      await dispatch(fetchDishes());
      await dispatch(fetchLunches());
    }

    if (!isDataPreloaded) preloadData();
  }, [dispatch, isDataPreloaded]);

  if (!isDataPreloaded) return <StyledLoader />;

  return (
    <Route
      path={props.path}
      exact={props.exact}
      render={() => (checkAuth() ? props.children : <Redirect to="/login" />)}
    />
  );
};

export default AuthRoute;

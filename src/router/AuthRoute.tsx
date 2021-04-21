import React, { FC, useEffect } from 'react';

import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store/store';
import { fetchLunches } from 'store/lunches';
import { fetchDishes } from 'store/dishes';
import StyledLoader from 'components/StyledLoader';

const AuthRoute: FC<RouteProps> = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );
  const isDataPreloaded = useSelector(
    (state: RootState) => state.lunches.isPreloaded,
  );

  useEffect(() => {
    async function preloadData() {
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
      render={() => (currentUser ? props.children : <Redirect to="/login" />)}
    />
  );
};

export default AuthRoute;

import React, { FC, useEffect, useState } from 'react';

import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

import { RootState } from 'store/store';
import { fetchDishes } from 'store/dishes';
import { fetchLunches } from '../store/lunches';

const AuthRoute: FC<RouteProps> = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );
  const [isDataPreloaded, setIsDataPreloaded] = useState<boolean>(false);

  useEffect(() => {
    async function preloadData() {
      await dispatch(fetchDishes());
      await dispatch(fetchLunches());
      setIsDataPreloaded(true);
    }

    preloadData();
  }, [dispatch]);

  if (!isDataPreloaded) return <CircularProgress />;

  return (
    <Route
      path={props.path}
      exact={props.exact}
      render={() => (currentUser ? props.children : <Redirect to="/login" />)}
    />
  );
};

export default AuthRoute;

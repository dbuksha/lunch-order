import React, { FC, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import { fetchLunches } from 'store/lunches';
import { fetchDishes } from 'store/dishes';
import { fetchUserInfo } from 'store/users';

import { checkAuth, logout } from 'utils/auth';

import StyledLoader from 'components/StyledLoader';

const AuthRoute: FC<RouteProps> = (props) => {
  const dispatch = useDispatch();
  const isDataPreloaded = useSelector(
    (state: RootState) => state.lunches.isPreloaded,
  );

  useEffect(() => {
    async function preloadData() {
      await dispatch(fetchDishes());
      await dispatch(fetchLunches());
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          dispatch(fetchUserInfo(user.email!));
        } else {
          logout();
        }
      });
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

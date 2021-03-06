import React, {
  FC,
  useEffect,
  ComponentClass,
  LazyExoticComponent,
} from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import { fetchSettings } from 'store/settings/settings-actions';
import { fetchDishes } from 'store/dishes';
import { fetchLunches } from 'store/lunches';
import { fetchDeliveryInfo } from 'store/delivery';
import { fetchUserInfo } from 'store/users';
import { fetchOrders } from 'store/orders';

import { checkAuth, logout } from 'utils/auth';

import StyledLoader from 'components/StyledLoader';
import Dashboard from 'pages/Admin/Dashboard';

export type RouteItem = {
  path: string;
  component: FC | ComponentClass | LazyExoticComponent<any>;
};

interface RoutePropsWithSubRoutes extends RouteProps {
  routes?: RouteItem[];
}

const AuthRoute: FC<RoutePropsWithSubRoutes> = (props) => {
  const dispatch = useDispatch();
  const isDataPreloaded = useSelector(
    (state: RootState) => state.lunches.isPreloaded,
  );
  const routes: RouteItem[] = props?.routes || [];

  useEffect(() => {
    async function preloadData() {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user && user.email) {
          dispatch(fetchUserInfo(user.email));
          dispatch(fetchSettings());
          dispatch(fetchDeliveryInfo());
        } else {
          logout();
        }
      });
      await dispatch(fetchDishes());
      await dispatch(fetchLunches());
      await dispatch(fetchOrders());
    }

    if (!isDataPreloaded) preloadData();
  }, [dispatch, isDataPreloaded]);

  if (!isDataPreloaded) return <StyledLoader />;

  if (!routes.length) {
    return (
      <Route
        path={props.path}
        exact={props.exact}
        render={() => (checkAuth() ? props.children : <Redirect to="/login" />)}
      />
    );
  }

  return (
    <Route
      path={props.path}
      exact={props.exact}
      render={() => (
        <>
          <Route path={props.path} component={Dashboard} exact />
          {routes.map((route) => (
            <Route
              path={`${route.path}`}
              component={route.component}
              key={route.path}
            />
          ))}
        </>
      )}
    />
  );
};

export default AuthRoute;

import React, { FC } from 'react';

import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

const AuthRoute: FC<RouteProps> = (props) => {
  const currentUser = useSelector((state: RootState) => state.users.user);

  return (
    <Route
      path={props.path}
      exact={props.exact}
      render={() => (currentUser ? props.children : <Redirect to="/login" />)}
    />
  );
};

export default AuthRoute;

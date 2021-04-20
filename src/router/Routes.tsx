import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

import AuthRoute from './AuthRoute';

import { routes } from './routes-props';

export const Routes: FC = () => {
  return (
    <React.Suspense fallback={<CircularProgress />}>
      <Switch>
        {routes.map(({ component, exact, path, auth }) => {
          const Component = auth ? AuthRoute : Route;
          const Child = component;

          return (
            <Component exact={exact} path={path} key={path}>
              <Child />
            </Component>
          );
        })}
      </Switch>
    </React.Suspense>
  );
};

import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';

import { routes } from './routes-props';

export const Routes: FC = () => {
  return (
    <Switch>
      {routes.map(({ component, exact, path, loginned }) => {
        const Component = loginned ? AuthRoute : Route;
        const Child = component;

        return (
          <Component exact={exact} path={path} key={path}>
            <Child />
          </Component>
        );
      })}
    </Switch>
  );
};

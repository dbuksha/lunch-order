import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';

import { routes } from './routes-props';

export const Routes: FC = () => {
  return (
    <Switch>
      {routes.map(({ component, exact, path }) => (
        <Route component={component} exact={exact} path={path} key={path} />
      ))}
    </Switch>
  );
};

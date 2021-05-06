import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import StyledLoader from 'components/StyledLoader';
import { useSelector } from 'react-redux';
import { getIsLoading } from 'store/app';

import AuthRoute from './AuthRoute';
import { routes } from './routes-props';

export const Routes: FC = () => {
  const isLoading = useSelector(getIsLoading);

  return (
    <React.Suspense fallback={<StyledLoader />}>
      {isLoading && <StyledLoader />}
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

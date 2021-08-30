import React, { FC, ComponentClass, LazyExoticComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import StyledLoader from 'components/StyledLoader';
import { useSelector } from 'react-redux';
import { getIsLoading } from 'store/app';

import AuthRoute from './AuthRoute';
import { routes } from './routes-props';

// import RouteWithSubRoutes from '../components/RouteWithSubRoutes';

// export type RouteItem = {
//   path: string;
//   component: FC | ComponentClass | LazyExoticComponent<any>;
// };

// export type RouteProp = {
//   path: string;
//   exact?: boolean;
//   auth?: boolean;
//   component: FC | ComponentClass | LazyExoticComponent<any>;
//   routes?: Array<RouteItem> | undefined;
// };

export const Routes: FC = () => {
  const isLoading = useSelector(getIsLoading);

  return (
    <React.Suspense fallback={<StyledLoader />}>
      {isLoading && <StyledLoader />}
      <Switch>
        {routes.map((route) => {
          const Component = route.auth ? AuthRoute : Route;
          const Child = route.component;

          return (
            <Component exact={route.exact} path={route.path} key={route.path}>
              <Child />
            </Component>
          );
        })}
      </Switch>
    </React.Suspense>
  );
};

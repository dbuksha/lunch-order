import { FC, ComponentClass, LazyExoticComponent } from 'react';
import { Home } from '../pages/Home';

export type RouteProp = {
  path: string;
  exact?: boolean;
  component: FC | ComponentClass | LazyExoticComponent<any>;
};

export const routes: RouteProp[] = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
];

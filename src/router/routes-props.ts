import { FC, ComponentClass, LazyExoticComponent } from 'react';
import { Home } from '../pages/Home';
import Login from '../pages/Login';
import OrderCreate from '../pages/OrderCreate';

export type RouteProp = {
  path: string;
  exact?: boolean;
  loginned?: boolean;
  component: FC | ComponentClass | LazyExoticComponent<any>;
};

export const routes: RouteProp[] = [
  {
    path: '/',
    exact: true,
    component: Home,
    loginned: true,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/orders/create',
    component: OrderCreate,
    loginned: true,
  },
];

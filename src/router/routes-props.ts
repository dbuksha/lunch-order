import { FC, ComponentClass, LazyExoticComponent } from 'react';

// components
import { Home } from 'pages/Home';
import Login from 'pages/Login';
import OrderCreate from 'pages/OrderCreate';
import OrdersList from 'pages/OrdersList/OrdersList';
import OrdersDelivery from 'pages/OrdersDelivery/OrdersDelivery';

export type RouteProp = {
  path: string;
  exact?: boolean;
  auth?: boolean;
  component: FC | ComponentClass | LazyExoticComponent<any>;
};

export const routes: RouteProp[] = [
  {
    path: '/',
    exact: true,
    component: Home,
    auth: true,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/orders/new',
    component: OrderCreate,
    auth: true,
  },
  {
    path: '/orders',
    component: OrdersList,
    auth: true,
    exact: true,
  },
  {
    path: '/orders/delivery',
    component: OrdersDelivery,
    auth: true,
  },
];

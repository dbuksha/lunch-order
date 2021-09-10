import { FC, ComponentClass, LazyExoticComponent, lazy } from 'react';

// components
import { Home } from 'pages/Home';
import Login from 'pages/Login';
import Dashboard from 'pages/Dashboard';
import DishesList from 'pages/DishesList';
import DishesNew from 'pages/DishesNew';
import ComplexList from 'pages/ComplexList';
import ComplexNewEdit from 'pages/ComplexNewEdit';
import UserList from 'pages/UserList';

const OrdersList = lazy(() => import('pages/OrdersList'));
const OrderCreate = lazy(() => import('pages/OrderCreate'));
const OrdersDelivery = lazy(() => import('pages/OrdersDelivery'));

export type RouteItem = {
  path: string;
  component: FC | ComponentClass | LazyExoticComponent<any>;
};

export type RouteProp = {
  path: string;
  exact?: boolean;
  auth?: boolean;
  component: FC | ComponentClass | LazyExoticComponent<any>;
  routes?: Array<RouteItem>;
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
  {
    path: '/admin',
    component: Dashboard,
    auth: true,
    routes: [
      {
        path: '/admin/dishes',
        component: DishesList,
      },
      {
        path: '/admin/dishes-edit/:id',
        component: DishesNew,
      },
      {
        path: '/admin/dishes-new',
        component: DishesNew,
      },
      {
        path: '/admin/complexes',
        component: ComplexList,
      },
      {
        path: '/admin/complex-edit/:id',
        component: ComplexNewEdit,
      },
      {
        path: '/admin/complex-new',
        component: ComplexNewEdit,
      },
      {
        path: '/admin/user-list',
        component: UserList,
      },
    ],
  },
];

import { FC, ComponentClass, LazyExoticComponent, lazy } from 'react';

// components
import { Home } from 'pages/Home';
import Login from 'pages/Login';
import Dashboard from 'pages/Admin/Dashboard';
import DishesList from 'pages/Admin/DishesList';
import DishesNew from 'pages/Admin/DishesNew';
import ComplexList from 'pages/Admin/ComplexList';
import ComplexNewEdit from 'pages/Admin/ComplexNewEdit';
import Orders from 'pages/Admin/Orders/Orders';
import OrderNewEdit from 'pages/Admin/OrderNewEdit/OrderNewEdit';
import CompletedOrders from 'pages/Admin/CompletedOrders';
import HistoryOrders from 'pages/Admin/HistoryOrders';
import UserList from 'pages/Admin/UserList';

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
        path: '/admin/orders',
        component: Orders,
      },
      {
        path: '/admin/order-edit/:id',
        component: OrderNewEdit,
      },
      {
        path: '/admin/order-new',
        component: OrderNewEdit,
      },
      {
        path: '/admin/completed-orders',
        component: CompletedOrders,
      },
      {
        path: '/admin/history-orders',
        component: HistoryOrders,
      },
      {
        path: '/admin/user-list',
        component: UserList,
      },
    ],
  },
];

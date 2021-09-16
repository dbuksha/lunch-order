import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import dayjs from 'dayjs';
import firebase from 'firebase/app';
import firebaseInstance, { Collections } from 'utils/firebase';

import {
  Box,
  Container,
  Grid,
  Select,
  Typography,
  Button,
  Theme,
  createStyles,
  makeStyles,
  Breadcrumbs,
} from '@material-ui/core';

// store
import {
  addOrder,
  deleteOrder,
  // getCurrentOrder,
  getOptionOrder,
  // updateOrder,
  updateOptionOrder,
  updateDishesQuantity,
  UpdateQuantityAction,
  resetOrder,
} from 'store/orders';
import { fetchAllUsers } from 'store/users';
import {
  getOptionOrderSelector,
  selectedOptionOrderDishesIdsSet,
} from 'store/orders/orders-selectors';
import { getAllUserSelector } from 'store/users/users-selectors';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';

// entities
import { Lunch } from 'entities/Lunch';
import { Dish } from 'entities/Dish';
import { OrderFirebase } from 'entities/Order';
import {
  getDayName,
  getOrderDayNumber,
  isTimeForTodayLunch,
} from 'utils/time-helper';
import { useTodayLunches } from 'use/useTodayLunches';

import Ruble from 'components/Ruble';

import ListDishes from 'components/ListDishes';
import Loader from '../../../components/StyledLoader';
import AdminLayout from '../../../components/AdminComponents/Layout/AdminLayout';

interface IParamsURL {
  id?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'inherit',
      },
    },
    item: {
      margin: theme.spacing(1),
    },
    total: {
      width: 120,
    },
    pageTitle: {
      '&:first-letter': {
        textTransform: 'capitalize',
      },
      wordWrap: 'break-word',
    },
    main: {
      margin: '40px auto',
    },
    link: {
      textDecoration: 'none',
      color: '#000',
    },
    fieldBox: {
      position: 'relative',
    },
    textField: {
      marginBottom: 40,
    },
    selectField: {
      width: 300,
      marginTop: 40,
      marginBottom: 20,
    },
    fieldError: {
      width: '100%',
      position: 'absolute',
      top: 58,
      left: 15,
      fontSize: 12,
      color: '#f44336',
    },
    formControl: {
      margin: theme.spacing(1),
      width: '100%',
    },
    formBlock: {
      width: 320,
      marginTop: 40,
    },
  }),
);

const getCurrentTypePage = (params: IParamsURL) => {
  if (params && params.id) {
    return 'edit';
  }

  return 'new';
};

const findLunchById = (lunches: Lunch[], lunchId: string): Lunch | null =>
  lunches.find((lunch: Lunch) => lunch.id === lunchId) || null;

const OrderNewEdit: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const paramsUrl = useParams() as IParamsURL;
  const [typePage] = useState(getCurrentTypePage(paramsUrl));
  const [loadingStatus] = useState(false);
  const todayLunches = useTodayLunches();
  const order = useSelector(getOptionOrderSelector);
  const selectedDishes = useSelector(selectedOptionOrderDishesIdsSet);
  const users = useSelector(getAllUserSelector);
  const [userSelected, setUserSelected] = useState('default');
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    if (paramsUrl && paramsUrl.id) {
      dispatch(getOptionOrder(paramsUrl.id));
      setUserSelected(paramsUrl.id);
    }
    if (!users.length) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch]);

  // recalculate order sum
  useEffect(() => {
    if (selectedDishes) {
      const price = deliveryDataHelper.calculateDeliveryPrice(order.dishes);
      setCalculatedPrice(price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDishes]);

  const onCreateOrderSubmit = async () => {
    // TODO: show an error popup
    if ((typePage === 'edit' && !paramsUrl.id) || !selectedDishes) return;

    if (userSelected === 'default') {
      console.log('Выберите пользователя');
      return;
    }

    const preparedDishes: any[] = [];

    setSendLoading(true);

    selectedDishes.forEach((quantity, id) => {
      preparedDishes.push({
        dishRef: firebaseInstance.doc(`${Collections.Dishes}/${id}`),
        quantity,
      });
    });

    // if lunch not for today: set tomorrow (8 a.m.)
    const time = isTimeForTodayLunch()
      ? dayjs()
      : dayjs().add(1, 'day').hour(8).startOf('h');

    const orderData: OrderFirebase = {
      date: firebase.firestore.Timestamp.fromDate(time.toDate()),
      dishes: preparedDishes,
      person: firebaseInstance.doc(`${Collections.Users}/${userSelected}`),
    };

    if (order) orderData.id = order.id;

    try {
      await dispatch(addOrder(orderData));
      await dispatch(resetOrder());
      setSendLoading(false);
      history.push('/admin/orders');
    } catch (e) {
      // TODO: handle an error
      console.log(e);
      setSendLoading(false);
    }
  };

  const onDishSelect = (
    lunchId: string,
    selected: boolean,
    quantity: number,
    dish?: Dish,
  ) => {
    let dishes = [];
    if (!dish) {
      const selectedLunch = findLunchById(todayLunches, lunchId);
      if (!selectedLunch) return;
      dishes = selectedLunch.dishes;
    } else {
      dishes = [dish];
    }

    dispatch(updateOptionOrder({ dishes, selected, quantity }));
  };

  // TODO: show alerts
  const onDeleteOrder = () => {
    async function handleDeleteOrder() {
      if (order?.id) {
        await dispatch(deleteOrder(order.id));
        await dispatch(resetOrder());
        history.push('/admin/orders');
      }
    }

    handleDeleteOrder();
  };

  const onChangeDishQuantity = (
    lunchId: string,
    type: UpdateQuantityAction,
    dish?: Dish,
  ) => {
    let dishes = [];
    if (!dish) {
      const selectedLunch = findLunchById(todayLunches, lunchId);
      if (!selectedLunch) return;
      dishes = selectedLunch.dishes;
    } else {
      dishes = [dish];
    }

    dispatch(updateDishesQuantity({ dishes, type }));
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>
          {typePage === 'new'
            ? 'Добавление нового заказа'
            : 'Редактирование заказа'}
        </title>
      </Helmet>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        {loadingStatus ? (
          <Loader />
        ) : (
          <Container>
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/admin/orders" className={classes.link}>
                Список текущих заказов
              </Link>
              <Typography variant="body1">
                {typePage === 'new'
                  ? 'Добавление нового заказа'
                  : 'Редактирование заказа'}
              </Typography>
            </Breadcrumbs>
            <Box className={classes.main}>
              <Typography
                className={classes.pageTitle}
                component="div"
                variant="h6"
              >
                {getDayName()}
                {dayjs().day() !== getOrderDayNumber() &&
                  '(предварительный заказ)'}
              </Typography>
              <Box className={classes.selectField}>
                <Select
                  native
                  value={userSelected}
                  onChange={(event: any) => setUserSelected(event.target.value)}
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    name: 'user',
                  }}
                >
                  <option value="default">Выберите пользователя</option>
                  {users.length
                    ? users.map((el: any) => (
                        <option value={el.id}>{el.name}</option>
                      ))
                    : null}
                </Select>
              </Box>
              <Grid container spacing={2}>
                {todayLunches?.map((lunch: Lunch) => (
                  <Grid item xs={12} sm={8} md={5} key={lunch.name}>
                    <Typography
                      component="div"
                      variant="subtitle1"
                      color="textSecondary"
                    >
                      {lunch.name}
                    </Typography>
                    <ListDishes
                      key={lunch.name}
                      dishes={lunch.dishes}
                      selectedDishes={selectedDishes}
                      selectDish={(selected, quantity, dish) =>
                        onDishSelect(lunch.id, selected, quantity, dish)
                      }
                      updateDishQuantity={(type, dish) =>
                        onChangeDishQuantity(lunch.id, type, dish)
                      }
                    />
                  </Grid>
                ))}
                <Grid
                  item
                  className={classes.root}
                  container
                  sm={12}
                  md={12}
                  lg={10}
                  justifyContent="space-between"
                  alignItems="baseline"
                >
                  <Typography
                    component="span"
                    variant="h6"
                    className={(classes.item, classes.total)}
                  >
                    Итого:{' '}
                    <strong>
                      {calculatedPrice}
                      <Ruble />
                    </strong>
                  </Typography>
                  <Box>
                    {order?.id && (
                      <Button
                        className={classes.item}
                        variant="outlined"
                        color="secondary"
                        onClick={onDeleteOrder}
                      >
                        Отменить заказ
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.item}
                      disabled={
                        !calculatedPrice ||
                        sendLoading ||
                        userSelected === 'default'
                      }
                      onClick={onCreateOrderSubmit}
                    >
                      {order?.id ? 'Обновить заказ' : 'Заказать'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        )}
      </Box>
    </AdminLayout>
  );
};

export default OrderNewEdit;

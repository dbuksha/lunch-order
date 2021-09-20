import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  Table,
  TableBody,
  TableRow,
  createStyles,
  makeStyles,
  Checkbox,
  Select,
  FormControlLabel,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { getIsLoading } from 'store/app';
import { fetchAllUsers, getAllUserSelector } from 'store/users';

import DeleteAlert from 'components/AdminComponents/Alerts/DeleteAlert';
import MainLayout from 'components/SiteLayout/MainLayout';
import Ruble from 'components/Ruble';
import DeliveryItem from './DeliveryItem';

import { useGroupedDishes } from './useGroupedDishes';
import { usePreparedDeliveryData } from './usePreparedDeliveryData';
import { useCalculatedDeliveryPrice } from './useCalculatedDeliveryPrice';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: 600,
      margin: '30px auto',
    },
    caption: {
      fontSize: 16,
      color: '#000',
    },
    alert: {
      margin: '20px auto',
    },
  }),
);

const OrdersDelivery: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isLoading = useSelector(getIsLoading);
  const gropedDishes = useGroupedDishes();
  const deliveryPrice = useCalculatedDeliveryPrice(gropedDishes);
  const deliveryData = usePreparedDeliveryData(gropedDishes);
  const users = useSelector(getAllUserSelector);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [payer, setPayer] = useState('default');
  const [dialogStatus, setDialogStatus] = useState('');

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch]);

  if (!deliveryData.length && !isLoading) {
    return (
      <MainLayout>
        <Alert variant="outlined" severity="info" className={classes.alert}>
          На сегодня еще нет заказов.
        </Alert>
      </MainLayout>
    );
  }

  const toggleDialogHandler = (state: string) => () => {
    if (deliveryCompleted) return;

    // if (state === '') setPayer('default');

    setDialogStatus(state);
  };

  const confirmDeliveryCompleted = () => {
    setDeliveryCompleted(true);
    toggleDialogHandler('')();
  };

  const handlePayerChange = (event: any) => {
    setPayer(event.target.value as string);
    setDialogStatus('payer');
  };

  const confirmSelectPayer = () => {
    toggleDialogHandler('')();
  };

  return (
    <MainLayout>
      <TableContainer component={Paper} className={classes.root}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <b>Заказы</b>
              </TableCell>
              <TableCell align="right">
                <b>Кол-во</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryData?.map((deliveryItem) => (
              <DeliveryItem
                name={deliveryItem.name}
                quantity={deliveryItem.quantity}
                key={deliveryItem.name}
              />
            ))}
            <TableRow>
              <TableCell align="left">
                <b className={classes.caption}>
                  Итого: {deliveryPrice}
                  <Ruble />
                </b>
              </TableCell>
              <TableCell align="right">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={deliveryCompleted}
                      onChange={toggleDialogHandler('delivery')}
                      color="primary"
                    />
                  }
                  label="Заказ сделан"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">
                <b>Получатель:</b>
              </TableCell>
              <TableCell align="right">
                <Select
                  native
                  value={payer}
                  onChange={handlePayerChange}
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
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteAlert
        status={dialogStatus !== ''}
        title={`${
          dialogStatus === 'delivery'
            ? 'Вы уверены, что вы заказали еду по телефону?'
            : 'Вы уверены, что хотите выбрать этого получателя?'
        }`}
        desc={`${
          dialogStatus === 'delivery'
            ? 'После того, как подтвердите действие, заказ еды на сегодняшний день будет недоступен'
            : 'После того, как подтвердите действие изменить получателя будет невозможно'
        }`}
        closeAlert={toggleDialogHandler('')}
        confirmEvent={
          dialogStatus === 'delivery'
            ? confirmDeliveryCompleted
            : confirmSelectPayer
        }
      />
    </MainLayout>
  );
};

export default OrdersDelivery;

import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Chip,
  Box,
  Button,
} from '@material-ui/core';
import { calculatePriceCard } from 'utils/orders';
import { isTimeForTodayLunch } from 'utils/time-helper';
import { Order } from 'entities/Order';
import OrderDishItem from 'pages/OrdersList/OrderDishItem';
import Ruble from 'components/Ruble';
import dayjs from 'utils/dayjs';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteAlert from 'components/AdminComponents/Alerts/DeleteAlert';

type OrderCardProps = {
  order: Order;
  adminMode: boolean;
  historyMode?: boolean;
  deleteOrder?: (id: string, personID: string) => void;
};

const useStyles = makeStyles({
  main: {
    height: '100%',
    paddingBottom: 60,
    position: 'relative',
  },
  tableCell: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.54)',
  },
  table: {
    width: '100%',
  },
  justifySpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  justifyFlexStart: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  resultContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `0 16px`,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  resultCost: {
    fontSize: 18,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    transform: `translateX(${12}px)`,
  },
  editLink: {
    width: 40,
    minWidth: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 40,
    minWidth: 40,
    height: 40,
  },
});

const OrderCard: FC<OrderCardProps> = ({
  order,
  adminMode,
  historyMode,
  deleteOrder,
}) => {
  const classes = useStyles();
  const [dialogStatus, setDialogStatus] = useState(false);

  const isTodayOrder = dayjs(order.date).day() === dayjs().day();

  const changeDialog = (state: boolean) => () => setDialogStatus(state);

  const deleteOrderHandler = () => {
    setDialogStatus(false);
    deleteOrder &&
      order &&
      order.id &&
      order.person &&
      order.person.id &&
      deleteOrder(order.id, order.person.id); // rewrite
  };

  const EditButton =
    order && order.person ? (
      <Button
        component={Link}
        className={classes.editLink}
        to={`/admin/order-edit/${order.person.id}`}
      >
        <EditIcon color="primary" />
      </Button>
    ) : null;

  return (
    <Paper className={classes.main}>
      <Toolbar className={classes.justifySpaceBetween}>
        {order && order.person ? (
          <>
            <Box className={classes.justifyFlexStart}>
              {order.person.avatar ? (
                <Avatar src={order.person.avatar} className={classes.avatar} />
              ) : null}
              <Typography component="div" variant="subtitle1">
                {order.person.name}
              </Typography>
            </Box>
          </>
        ) : null}
        {historyMode ? (
          <Chip
            label={dayjs(order.date).format('DD.MM.YYYY')}
            color="default"
          />
        ) : (
          <Chip
            label={isTodayOrder ? 'Сегодня' : 'Завтра'}
            color={isTodayOrder ? 'primary' : 'default'}
          />
        )}
      </Toolbar>
      <TableContainer>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell} align="left">
                Наименование
              </TableCell>
              <TableCell className={classes.tableCell} align="right">
                Стоимость
              </TableCell>
              <TableCell className={classes.tableCell} align="right">
                Кол-во
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.dishes.map(({ dish, quantity }) => (
              <TableRow key={dish.id}>
                <OrderDishItem dish={dish} quantity={quantity} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className={classes.resultContainer}>
        <Box>
          <p className={classes.resultCost}>
            <b>
              Итого: {calculatePriceCard(order.dishes)}
              <Ruble />
            </b>
          </p>
        </Box>
        {adminMode ? (
          <Box className={classes.btnContainer}>
            {isTodayOrder && isTimeForTodayLunch() ? EditButton : null}
            {!isTodayOrder ? EditButton : null}
            <Button className={classes.deleteBtn} onClick={changeDialog(true)}>
              <DeleteIcon color="error" />
            </Button>
          </Box>
        ) : null}
      </Box>
      <DeleteAlert
        status={dialogStatus}
        title="Вы уверены, что хотите удалить данный заказ?"
        desc="Данный заказ будет навсегда удален из базы данных"
        closeAlert={changeDialog(false)}
        confirmEvent={deleteOrderHandler}
      />
    </Paper>
  );
};
export default OrderCard;

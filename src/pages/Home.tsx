import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme, Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/users';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiButton-root': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

export const Home: FC = () => {
  const classes = useStyles();
  const currentUser = useSelector(getCurrentUser);

  return (
    <Container className={classes.root} maxWidth="xs">
      <Button
        component={Link}
        to="/orders/new"
        fullWidth
        variant="contained"
        color="primary"
      >
        Сделать Заказ
      </Button>

      <Button
        component={Link}
        to="/orders"
        fullWidth
        variant="contained"
        color="primary"
      >
        Список заказов
      </Button>

      <Button
        component={Link}
        to="/orders/delivery"
        fullWidth
        variant="contained"
        color="primary"
      >
        Заказать доставку
      </Button>

      {/* if user === admin (check email) */}
      {currentUser && currentUser.phone.toString() === '9518357686' ? (
        <Button
          component={Link}
          to="dashboard"
          fullWidth
          variant="contained"
          color="primary"
        >
          Администрирование
        </Button>
      ) : null}
    </Container>
  );
};

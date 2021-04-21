import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme, Container } from '@material-ui/core';

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
    </Container>
  );
};

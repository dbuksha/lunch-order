import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Box,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& .MuiButton-root': {
        marginTop: theme.spacing(3),
      },
    },
    btnContainer: {},
  }),
);

export const Home: FC = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="xs">
      <Box>
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
      </Box>
    </Container>
  );
};

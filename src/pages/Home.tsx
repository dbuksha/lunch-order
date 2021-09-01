import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Box,
  Button,
} from '@material-ui/core';

import MainLayout from 'components/SiteLayout/MainLayout';

import { getUserSelector } from 'store/users';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 'calc(100vh - 64px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& .MuiButton-root': {
        marginTop: theme.spacing(3),
      },
    },
  }),
);

export const Home: FC = () => {
  const classes = useStyles();
  const user = useSelector(getUserSelector);

  return (
    <MainLayout>
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

          {user && user.role === 'admin' ? (
            <Button
              component={Link}
              to="/admin"
              fullWidth
              variant="contained"
              color="primary"
            >
              Администрирование
            </Button>
          ) : null}
        </Box>
      </Container>
    </MainLayout>
  );
};

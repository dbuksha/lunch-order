import React, { FC, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme, Box } from '@material-ui/core';

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
    <>
      <Box className={classes.root}>
        <Button
          component={Link}
          to="/orders/create"
          fullWidth
          variant="contained"
          color="primary"
        >
          Сделать Заказ
        </Button>

        <Button
          component={Link}
          to="/about"
          fullWidth
          variant="contained"
          color="primary"
        >
          Список заказов
        </Button>

        <Button
          component={Link}
          to="/order"
          fullWidth
          variant="contained"
          color="primary"
        >
          Заказать доставку
        </Button>
      </Box>
    </>
  );
};

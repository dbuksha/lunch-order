import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme, Box } from '@material-ui/core';
import { RootState } from '../store/store';

import { fetchDishes } from '../store/dishes';

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
  const dispatch = useDispatch();
  const dishes = useSelector((state: RootState) => state.dishes.dishes);

  useEffect(() => {
    dispatch(fetchDishes());
  }, [dispatch]);

  return (
    <>
      <p>{JSON.stringify(dishes)}</p>
      <Box className={classes.root}>
        <Button
          component={Link}
          to="/about"
          fullWidth
          variant="contained"
          color="primary"
        >
          Create order
        </Button>

        <Button
          component={Link}
          to="/about"
          fullWidth
          variant="contained"
          color="primary"
        >
          Order List
        </Button>

        <Button
          component={Link}
          to="/order"
          fullWidth
          variant="contained"
          color="primary"
        >
          Call for delivery
        </Button>
      </Box>
    </>
  );
};

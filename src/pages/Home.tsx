import React, { FC, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme, Box } from '@material-ui/core';
import { useDispatch } from 'react-redux';
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

  useEffect(() => {
    dispatch(fetchDishes());
  }, [dispatch]);

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

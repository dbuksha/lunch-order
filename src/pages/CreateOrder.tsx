import React, { useState, FC, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
// store
import { RootState } from '../store/store';
import { fetchLunches, updateSelectedLunches } from '../store/lunches';
// components
import ListDishes from '../components/orders/List-Dishes';
// entities
import { Lunch } from '../entities/Lunch';
import { Dish } from '../entities/Dish';
import { Order } from '../entities/Order';
import { User } from '../entities/User';

// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
import firebaseInstance from '../utils/firebase/firebase-init';
import { Collections } from '../utils/firebase';

const collectionRef = firebaseInstance.collection(Collections.Orders);

const createOrder = async (dishes: Dish[], user: User) => {
  const prepared = dishes.map((d) => ({
    dish: firebaseInstance.doc(`dishes/${d.id}`),
    quantity: 1,
  }));

  const order: Omit<Order, 'id'> = {
    date: new Date(),
    order: prepared,
    person: firebaseInstance.doc(`persons/${user.id}`),
  };

  await collectionRef.add(order);
};
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------

const dayNumber = new Date().getDay();

const CreateOrder: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector((state: RootState) => state.users.user);
  const lunches = useSelector((state: RootState) => state.lunches.lunches);

  useEffect(() => {
    dispatch(fetchLunches(dayNumber));
  }, [dispatch]);

  const onDishSelect = (lunchId: string, dishId: string, value: boolean) => {
    dispatch(updateSelectedLunches({ lunchId, dishId, selected: value }));
  };

  const onSelectFullLunch = (lunchId: string, value: boolean) => {
    dispatch(updateSelectedLunches({ lunchId, selected: value }));
  };

  const onCreateOrderClicked = async () => {
    const selectedDishes: Dish[] = lunches
      .flatMap((l) => l.dishes)
      .filter((d) => d.selected);

    try {
      setIsLoading(true);
      await createOrder(selectedDishes, currentUser!);
      history.push('/');
      setIsLoading(false);
    } catch (e) {
      console.log('something went wrong');
    }
  };

  return (
    <Grid container spacing={2}>
      {lunches.map((lunch: Lunch) => (
        <ListDishes
          key={lunch.name}
          lunch={lunch}
          selectFullLunch={(value) => onSelectFullLunch(lunch.id, value)}
          selectDish={(dishId, value) => onDishSelect(lunch.id, dishId, value)}
        />
      ))}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={isLoading}
        onClick={onCreateOrderClicked}
      >
        Create order
      </Button>
    </Grid>
  );
};

export default CreateOrder;

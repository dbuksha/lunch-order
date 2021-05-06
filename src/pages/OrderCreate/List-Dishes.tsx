import React, { FC, useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  TextField,
} from '@material-ui/core';

import { Dish } from 'entities/Dish';
import { calculateDishesPrice } from 'utils/orders';
import { useSelectDishes } from 'pages/OrderCreate/useSelectDishes';
import Ruble from 'components/Ruble';

export type ListDishesProps = {
  dishes: Dish[];
  selectedDishes: Set<string>;
  selectDish: (selected: boolean, dish?: Dish) => void;
};

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  label: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const ListDishes: FC<ListDishesProps> = ({
  dishes,
  selectDish,
  selectedDishes,
}) => {
  const classes = useStyles();
  const { selectedAll, handleSelectedAll } = useSelectDishes({
    dishes,
    selectedDishes,
    selectDish,
  });
  const [lunchPrice] = useState<number>(() => calculateDishesPrice(dishes));

  return (
    <FormGroup>
      <FormControlLabel
        classes={classes}
        control={
          <div>
            <Checkbox
              checked={selectedAll}
              onChange={handleSelectedAll}
              name="selectAll"
            />
          </div>
        }
        label={
          <>
            Полный комплекс{' '}
            <b>
              {lunchPrice}
              <Ruble />
            </b>
          </>
        }
      />
      {dishes.map((dish: Dish) => (
        <FormControlLabel
          classes={classes}
          key={dish.id}
          control={
            <>
              <Checkbox
                checked={selectedDishes.has(dish.id)}
                onChange={(e) => selectDish(e.target.checked, dish)}
                disabled={selectedAll}
                name={dish.name}
              />
              <TextField type="number" />
            </>
          }
          label={
            <>
              {dish.name}{' '}
              <b>
                {dish.price}
                <Ruble />
              </b>
            </>
          }
        />
      ))}
    </FormGroup>
  );
};

export default ListDishes;

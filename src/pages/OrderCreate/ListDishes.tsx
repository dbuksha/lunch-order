import React, { FC, useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  TextField,
} from '@material-ui/core';

import { Dish, SelectedDishes } from 'entities/Dish';
import { calculateDishesPrice } from 'utils/orders';
import { useSelectDishes } from 'pages/OrderCreate/useSelectDishes';
import Ruble from 'components/Ruble';

export type ListDishesProps = {
  dishes: Dish[];
  selectedDishes: SelectedDishes;
  selectDish: (selected: boolean, quantity: number, dish?: Dish) => void;
  changeDishQuantity: (quantiy: number, dish?: Dish) => void;
};

// const getMinLunchQuantity = (selectedDishesIds: number[], lunchDishes: any) => {
const getMinLunchQuantity = (selectedDishes: IterableIterator<number>) => {
  return Math.min(...selectedDishes);
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
  const minLunchQuantity = getMinLunchQuantity(selectedDishes.values());

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
            <span>Полный комплекс</span>
            <div>
              <TextField
                type="number"
                size="small"
                disabled={!selectedAll}
                value={minLunchQuantity}
                onChange={(e) => selectDish(true, Number(e.target.value))}
              />
              <b>
                {lunchPrice}
                <Ruble />
              </b>
            </div>
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
                onChange={(e) => selectDish(e.target.checked, 1, dish)}
                disabled={selectedAll}
                name={dish.name}
              />
            </>
          }
          label={
            <>
              <span>{dish.name}</span>
              <div>
                <TextField
                  size="small"
                  type="number"
                  disabled={!selectedDishes.has(dish.id)}
                  value={selectedDishes.get(dish.id) || 1}
                  onChange={(e) =>
                    selectDish(true, Number(e.target.value), dish)
                  }
                />
                <b>
                  {dish.price}
                  <Ruble />
                </b>
              </div>
            </>
          }
        />
      ))}
    </FormGroup>
  );
};

export default ListDishes;

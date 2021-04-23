import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
} from '@material-ui/core';

import { Dish } from 'entities/Dish';
import { calculateDishesPrice } from 'utils/orders';

type ListDishesProps = {
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
  const [selectedAll, setSelectedAll] = useState(false);
  const [lunchPrice] = useState<number>(() => calculateDishesPrice(dishes));

  // set selectedAll when all lunch dishes were selected one by one or on first load page with existing order
  useEffect(() => {
    // check if every dish id is in selected dishes
    if (selectedDishes.size && dishes.length) {
      const parStr = JSON.stringify(sortBy([...selectedDishes]));
      setSelectedAll(
        dishes.map((d) => d.id).every((id) => parStr.indexOf(id) !== -1),
      );
    }
  }, [dishes, selectedDishes]);

  const handleSelectedAll = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedAll(e.target.checked);
    selectDish(e.target.checked);
  };

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
            Полный комплекс <b>{lunchPrice}&#8381;</b>
          </>
        }
      />
      {dishes.map((dish: Dish) => (
        <FormControlLabel
          classes={classes}
          key={dish.id}
          control={
            <Checkbox
              checked={selectedDishes.has(dish.id)}
              onChange={(e) => selectDish(e.target.checked, dish)}
              disabled={selectedAll}
              name={dish.name}
            />
          }
          label={
            <>
              {dish.name} <b>{dish.price}&#8381;</b>
            </>
          }
        />
      ))}
    </FormGroup>
  );
};

export default ListDishes;

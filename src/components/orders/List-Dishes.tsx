import React, { ChangeEvent, FC, useState } from 'react';
import {
  Checkbox,
  createStyles,
  FormControlLabel,
  FormGroup,
  makeStyles,
} from '@material-ui/core';

import { Dish } from 'entities/Dish';
import { calculateDishesPrice } from 'utils/orders';

type ListDishesProps = {
  dishes: Dish[];
  selectDish: (selected: boolean, id?: string) => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '& .MuiFormControlLabel-root': {
        width: '100%',
      },
      '& .MuiFormControlLabel-label': {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      },
    },
  }),
);

const ListDishes: FC<ListDishesProps> = ({ dishes, selectDish }) => {
  const classes = useStyles();
  const [selectedAll, setSelectedAll] = useState(() =>
    dishes.every((d) => d.selected),
  );
  const [lunchPrice] = useState<number>(() => calculateDishesPrice(dishes));

  const handleSelectedAll = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedAll(e.target.checked);
    selectDish(e.target.checked);
  };

  return (
    <>
      <FormGroup className={classes.root}>
        <FormControlLabel
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
            key={dish.id}
            control={
              <Checkbox
                checked={dish.selected}
                onChange={(e) => selectDish(e.target.checked, dish.id)}
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
    </>
  );
};

export default ListDishes;

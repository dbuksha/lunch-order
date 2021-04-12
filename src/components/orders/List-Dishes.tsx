import React, { ChangeEvent, FC, useState } from 'react';
import {
  Checkbox,
  createStyles,
  FormControlLabel,
  FormGroup,
  Grid,
  ListSubheader,
  makeStyles,
} from '@material-ui/core';

import { Lunch } from 'entities/Lunch';
import { Dish } from 'entities/Dish';
import { calculateDishesPrice } from 'utils/orders';

type ListDishesProps = {
  lunch: Lunch;
  selectDish: (id: string, selected: boolean) => void;
  selectFullLunch: (selected: boolean) => void;
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

const ListDishes: FC<ListDishesProps> = ({
  lunch: { dishes, name },
  selectFullLunch,
  selectDish,
}) => {
  const classes = useStyles();
  const [selectedAll, setSelectedAll] = useState(false);
  const [calculatedPrice] = useState<number>(() => {
    return calculateDishesPrice(dishes);
  });

  const handleSelectedAll = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedAll(e.target.checked);
    selectFullLunch(e.target.checked);
  };

  return (
    <Grid item xs={12} sm={6}>
      <ListSubheader component="div">{name}</ListSubheader>
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
              Полный комплекс <b>{calculatedPrice}&#8381;</b>
            </>
          }
        />
        {dishes.map((dish: Dish) => (
          <FormControlLabel
            key={dish.id}
            control={
              <Checkbox
                checked={dish.selected}
                onChange={(e) => selectDish(dish.id, e.target.checked)}
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
    </Grid>
  );
};

export default ListDishes;

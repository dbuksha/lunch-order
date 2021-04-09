import React, { ChangeEvent, FC, useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  ListSubheader,
} from '@material-ui/core';

import { Lunch } from '../../entities/Lunch';
import { Dish } from '../../entities/Dish';

type ListDishesProps = {
  lunch: Lunch;
  selectDish: (id: string, selected: boolean) => void;
  selectFullLunch: (selected: boolean) => void;
};

const ListDishes: FC<ListDishesProps> = ({
  lunch: { dishes, name },
  selectFullLunch,
  selectDish,
}) => {
  const [selectedAll, setSelectedAll] = useState(false);
  const handleSelectedAll = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedAll(e.target.checked);
    selectFullLunch(e.target.checked);
  };
  return (
    <Grid item xs={12} sm={6}>
      <ListSubheader component="div">{name}</ListSubheader>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedAll}
            onChange={handleSelectedAll}
            name="selectAll"
          />
        }
        label="Полный комплекс"
      />
      <FormGroup>
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
            label={dish.name}
          />
        ))}
      </FormGroup>
    </Grid>
  );
};

export default ListDishes;

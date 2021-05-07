import React, { FC, useState } from 'react';
import {
  Checkbox,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
  quantityCell: {
    width: '20%',
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
    <TableContainer>
      <Table aria-label="simple table" size="small">
        <TableBody>
          <TableRow>
            <TableCell padding="none">
              <Checkbox
                checked={selectedAll}
                onChange={handleSelectedAll}
                name="selectAll"
              />
            </TableCell>
            <TableCell component="th" scope="row" padding="none">
              Полный комплекс
            </TableCell>
            <TableCell>
              <TextField
                type="number"
                size="small"
                disabled={!selectedAll}
                value={minLunchQuantity}
                onChange={(e) => selectDish(true, Number(e.target.value))}
              />
            </TableCell>
            <TableCell align="right" size="small" padding="none">
              <b>
                {lunchPrice}
                <Ruble />
              </b>
            </TableCell>
          </TableRow>

          {dishes.map((dish: Dish) => (
            <TableRow>
              <TableCell padding="none">
                <Checkbox
                  checked={selectedDishes.has(dish.id)}
                  onChange={(e) => selectDish(e.target.checked, 1, dish)}
                  disabled={selectedAll}
                  name={dish.name}
                />
              </TableCell>
              <TableCell component="th" scope="row" padding="none">
                {dish.name}
              </TableCell>
              <TableCell
                align="right"
                size="small"
                className={classes.quantityCell}
              >
                <TextField
                  size="small"
                  type="number"
                  disabled={!selectedDishes.has(dish.id)}
                  value={selectedDishes.get(dish.id) || 1}
                  onChange={(e) =>
                    selectDish(true, Number(e.target.value), dish)
                  }
                />
              </TableCell>
              <TableCell align="right" padding="none">
                <b>
                  {dish.price}
                  <Ruble />
                </b>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListDishes;

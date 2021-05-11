import React, { FC } from 'react';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';

import { Dish, SelectedDishes } from 'entities/Dish';
import { useSelectDishes } from 'pages/OrderCreate/useSelectDishes';
import Ruble from 'components/Ruble';
import InputNumber from 'components/InputNumber';
import { useLunchData } from 'pages/OrderCreate/useLunchData';

export type ListDishesProps = {
  dishes: Dish[];
  selectedDishes: SelectedDishes;
  selectDish: (selected: boolean, quantity: number, dish?: Dish) => void;
  changeDishQuantity: (quantiy: number, dish?: Dish) => void;
};

const ListDishes: FC<ListDishesProps> = ({
  dishes,
  selectDish,
  selectedDishes,
}) => {
  const { selectedAll, handleSelectedAll } = useSelectDishes({
    dishes,
    selectedDishes,
    selectDish,
  });
  const { lunchPrice, minLunchQuantity } = useLunchData(dishes, selectedDishes);

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
                size="small"
              />
            </TableCell>
            <TableCell component="th" scope="row" padding="none">
              Полный комплекс
            </TableCell>
            <TableCell align="right" size="small" padding="none">
              <InputNumber
                disabled={!selectedAll}
                min={0}
                value={minLunchQuantity}
                onChange={(quantity) => selectDish(true, quantity)}
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
            <TableRow key={dish.id}>
              <TableCell padding="none">
                <Checkbox
                  checked={selectedDishes.has(dish.id)}
                  onChange={(e) => selectDish(e.target.checked, 1, dish)}
                  disabled={selectedAll}
                  name={dish.name}
                  size="small"
                />
              </TableCell>
              <TableCell component="th" scope="row" padding="none">
                {dish.name}
              </TableCell>
              <TableCell align="right" size="small" padding="none">
                <InputNumber
                  value={selectedDishes.get(dish.id) || 1}
                  disabled={!selectedDishes.has(dish.id)}
                  min={1}
                  onChange={(quantity) => selectDish(true, quantity, dish)}
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

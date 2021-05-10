import React, { FC, useState } from 'react';
import {
  Checkbox,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';

import { Dish, SelectedDishes } from 'entities/Dish';
import { calculateDishesPrice } from 'utils/orders';
import { useSelectDishes } from 'pages/OrderCreate/useSelectDishes';
import Ruble from 'components/Ruble';
import InputNumber from 'components/InputNumber';
import { intersection } from 'lodash';

export type ListDishesProps = {
  dishes: Dish[];
  selectedDishes: SelectedDishes;
  selectDish: (selected: boolean, quantity: number, dish?: Dish) => void;
  changeDishQuantity: (quantiy: number, dish?: Dish) => void;
};

const getMinLunchQuantity = (
  lunchDishesIds: string[],
  selectedDishes: SelectedDishes,
) => {
  const isFullSelected = lunchDishesIds.every(
    (id) => [...selectedDishes.keys()].indexOf(id) > -1,
  );
  if (!isFullSelected) return 0;

  const l = intersection<string>([...selectedDishes.keys()], lunchDishesIds);
  const filteredData = new Map(
    [...selectedDishes].filter(([k, v]) => l.indexOf(k) > -1),
  );

  return Math.min(...filteredData.values());
};

export const isFullLunchExist = (
  lunchDishesIds: string[],
  dishesIds: string[],
): boolean => {
  return lunchDishesIds.every((id) => dishesIds.indexOf(id) > -1);
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
  const [lunchPrice] = useState<number>(() => calculateDishesPrice(dishes));
  const minLunchQuantity = getMinLunchQuantity(
    dishes.map((d) => d.id),
    selectedDishes,
  );

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

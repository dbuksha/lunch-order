import { ChangeEvent, useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import { ListDishesProps } from 'pages/OrderCreate/List-Dishes';

const getSortedDishesString = (dishes: string[]) =>
  JSON.stringify(sortBy(dishes));

export const useSelectDishes = ({
  dishes,
  selectedDishes,
  selectDish,
}: ListDishesProps) => {
  const [selectedAll, setSelectedAll] = useState(false);

  // set selectedAll when all lunch dishes were selected one by one or on first load page with existing order
  useEffect(() => {
    // check if every dish id is in selected dishes
    if (selectedDishes.size && dishes.length) {
      const selectedDishesStr = getSortedDishesString([...selectedDishes]);
      const dishesToUpdate = dishes
        .map((d) => d.id)
        .every((id) => selectedDishesStr.indexOf(id) !== -1);

      setSelectedAll(dishesToUpdate);
    }
  }, [dishes, selectedDishes]);

  const handleSelectedAll = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedAll(e.target.checked);
    selectDish(e.target.checked);
  };

  return { selectedAll, handleSelectedAll };
};

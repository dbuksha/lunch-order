export type Dish = {
  id: string;
  name: string;
  price: number;
  weight: number;
  quantity?: number;
};

export type DishesMap = Record<string, Dish>;

export type Dish = {
  id: string;
  name: string;
  price: number;
  weight: number;
};

export type OrderDish = {
  id?: string;
  dish: Dish;
  quantity: number;
};

export type DishesMap = Record<string, Dish>;

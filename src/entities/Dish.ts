export type Dish = {
  id: string;
  name: string;
  price: number;
  weight: number;
  category?: string;
};

export type OrderDish = {
  id?: string;
  dish: Dish;
  quantity: number;
  userID?: string;
  users?: string[];
};

export type SelectedDishes = Map<string, number>;

export type DishesMap = Record<string, Dish>;

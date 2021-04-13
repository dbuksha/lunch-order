import { Dish } from './Dish';

export type Lunch = {
  id: string;
  dayNumber: number;
  name: string;
  dishes: Dish[];
};

export type LunchState = {
  id: string;
  dayNumber: number;
  name: string;
  dishes: string[];
};

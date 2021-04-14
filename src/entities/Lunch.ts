import { Dish } from './Dish';

export type Lunch = {
  id: string;
  dayNumber: number;
  name: string;
  dishes: Dish[];
};

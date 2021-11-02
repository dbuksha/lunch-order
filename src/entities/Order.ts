import firebase from 'firebase/app';
import { DocumentData, DocumentReference } from 'utils/firebase';

import { OrderDish } from './Dish';
import { UserNew } from './User';

export type Order = {
  id?: string;
  dishes: OrderDish[];
  dishesWithUser?: OrderDish[];
  person?: UserNew;
  date?: number;
};

export type OrderFirebase = {
  id?: string;
  dishes: {
    dishRef: DocumentReference<DocumentData>;
    quantity: number;
  }[];
  person: DocumentReference<DocumentData>;
  date: firebase.firestore.Timestamp;
};

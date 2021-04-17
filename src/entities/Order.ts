import firebase from 'firebase/app';
import { DocumentData, DocumentReference } from 'utils/firebase';

import { OrderDish } from './Dish';
import { User } from './User';

export type Order = {
  id?: string;
  dishes: OrderDish[];
  person?: User;
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

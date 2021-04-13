import firebase from 'firebase/app';
import { User } from './User';
import { Dish } from './Dish';

import DocumentData = firebase.firestore.DocumentData;
import DocumentReference = firebase.firestore.DocumentReference;

export type Order = {
  id: string;
  dishes: Dish[];
  person?: User;
  date: number;
};

export type OrderFirebase = {
  id?: string;
  dishes: {
    dishRef: DocumentReference<DocumentData>;
    quantity: number;
  }[];
  person: DocumentReference<DocumentData>;
  date: Date;
};

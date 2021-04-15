import firebase from 'firebase/app';
import { User } from './User';
import { Dish } from 'entities/Dish';

import DocumentData = firebase.firestore.DocumentData;
import DocumentReference = firebase.firestore.DocumentReference;

export type Order = {
  id?: string;
  dishes: {
    dish: Dish;
    quantity: number;
  }[];
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

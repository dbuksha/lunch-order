import firebase from 'firebase/app';

export type Transaction = {
  id: string;
  date: firebase.firestore.Timestamp;
  description: string;
  amount: number;
  type: string;
};

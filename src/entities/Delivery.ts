import firebase from 'firebase';

export type Delivery = {
  id: string;
  date: number;
};

export type DeliveryFirebase = {
  id?: string;
  date: firebase.firestore.Timestamp;
};

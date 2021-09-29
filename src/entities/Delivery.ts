import firebase from 'firebase/app';
import { DocumentData, DocumentReference } from 'utils/firebase';
import { UserNew } from './User';

export type DeliveryData = {
  id?: string;
  createDate: firebase.firestore.Timestamp;
  dishes: {
    name: string;
    quantity: number;
  }[];
  payer: UserNew | null;
  total: number;
};

export type DeliveryDataFirebase = {
  id?: string;
  createDate: firebase.firestore.Timestamp;
  dishes: {
    name: string;
    quantity: number;
  }[];
  payer: DocumentReference<DocumentData> | null;
  total: number;
};

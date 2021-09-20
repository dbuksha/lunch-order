import firebase from 'firebase/app';
import { DocumentData, DocumentReference } from 'utils/firebase';

export type DeliveryData = {
  id?: string;
  createDate: firebase.firestore.Timestamp;
  dishes: {
    name: string;
    quantity: number;
  }[];
  payer: null | DocumentReference<DocumentData>;
};

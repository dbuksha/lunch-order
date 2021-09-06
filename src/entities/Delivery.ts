import firebase from 'firebase/app';
import { DocumentData, DocumentReference } from 'utils/firebase';
// import { Order } from './Order';
// import { UserNew } from './User';

export type Delivery = {
  id: string;
  date: firebase.firestore.Timestamp;
  ordered: boolean;
  payer: DocumentReference<DocumentData>;
  orders: DocumentReference<DocumentData>[];
};

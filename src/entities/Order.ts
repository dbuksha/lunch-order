import firebase from 'firebase';
import DocumentData = firebase.firestore.DocumentData;
import DocumentReference = firebase.firestore.DocumentReference;

export type Order = {
  id: string;
  order: {
    dish: DocumentReference<DocumentData>;
    quantity: number;
  }[];
  person: DocumentReference<DocumentData>;
  date: Date;
};

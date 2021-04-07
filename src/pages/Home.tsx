import React, { FC, useEffect } from 'react';
import firebase from 'firebase';
import firebaseEntity from '../utils/firebase/firebase-init';

type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;
type DocumentData = firebase.firestore.DocumentData;

export const Home: FC = () => {
  const collectionRef = firebaseEntity.collection('dishes');

  useEffect(() => {
    const mapApi = async (): Promise<void> => {
      const dishes: QuerySnapshot<DocumentData> = await collectionRef.get();
      dishes.forEach((d) => console.log(d.data()));
    };

    mapApi();
  }, [collectionRef]);
  return <p>Hello, home page</p>;
};

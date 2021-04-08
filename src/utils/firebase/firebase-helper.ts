import firebase from 'firebase';

type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;
type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;

type DocumentData = firebase.firestore.DocumentData;

export const getCollectionEntries = <T>(
  data: QuerySnapshot<DocumentData>,
): T[] => {
  const result: T[] = [];
  data.forEach((doc) => result.push(doc.data() as T));

  return result;
};

export const getDocumentEntry = <T>(entryData: DocumentSnapshot<T>): T => {
  return entryData.data() as T;
};

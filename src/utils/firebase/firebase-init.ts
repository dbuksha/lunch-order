import firebase from 'firebase/app';
import 'firebase/firebase-firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBiJBXOeDrdpV3zBQ3NgB2UqTUBrNe8f_Y',
  authDomain: 'distidishes.firebaseapp.com',
  projectId: 'distidishes',
  storageBucket: 'distidishes.appspot.com',
  messagingSenderId: '183967005701',
  appId: '1:183967005701:web:2a1d76877b5547efdd706c',
  measurementId: 'G-FC0Q00GK67',
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();

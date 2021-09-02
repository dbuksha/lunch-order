import Cookies from 'js-cookie';
import firebase from 'firebase/app';
import 'firebase/auth';

export const checkAuth = (): boolean => {
  const token = Cookies.get('token');

  if (token) {
    return true;
  }

  return false;
};

export const logout = (): void => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      Cookies.remove('token');
      window.location.href = '/login';
    })
    .catch((error) => {
      console.log('auth error - ', error);
    });
};

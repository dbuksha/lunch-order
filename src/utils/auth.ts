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

export const logout = async (): Promise<void> => {
  await firebase
    .auth()
    .signOut()
    .then(() => {
      Cookies.remove('token');
      window.location.href = '/login';
    })
    .catch((error) => {
      console.log('auth error - ', error);
    });
};

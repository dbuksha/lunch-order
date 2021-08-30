import React, { FC } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  Box,
  Typography,
  Button,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { addNewUser } from 'store/users';
import Cookies from 'js-cookie';

import { UserNew } from '../../entities/User';

import LogoImg from '../../logo.svg';
import LogoGoogle from '../../google-icon.svg';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: 400,
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: '40px 32px',
      backgroundColor: '#fff',
      borderRadius: '2px',
      boxShadow: '0 8px 14px 3px rgb(0 0 0 / 5%)',
    },
    containerLogo: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textDecoration: 'none',
      marginBottom: 40,
    },
    logo: {
      width: '60px',
      height: '60px',
    },
    title: {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      fontSize: '28px',
      fontWeight: 700,
      color: '#000',
      marginLeft: '12px',
      textDeraration: 'none',
    },
    btn: {
      width: '100%',
      textTransform: 'none',
      backgroundColor: '#eee',
      padding: '6px 12px',
      '&:hover': {
        backgroundColor: '#ebebeb',
      },
    },
    googleLogo: {
      width: '28px',
      height: '28px',
      marginRight: 8,
    },
  }),
);

const provider = new firebase.auth.GoogleAuthProvider();

const LoginFormNew: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const loginHandler = async (provider: firebase.auth.AuthProvider) => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        const { user } = result;

        const credential = result.credential as firebase.auth.OAuthCredential;
        const token = credential.accessToken;

        Cookies.set('token', token!, { expires: 7 });

        if (user) {
          const userData: UserNew = {
            avatar: user.photoURL,
            createDate: firebase.firestore.Timestamp.now().toMillis(),
            email: user.email,
            phone: `${user.phoneNumber}`,
            name: user.displayName,
            role: 'user',
            uid: user.uid,
          };

          dispatch(addNewUser(userData));
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        // const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // const credential = error.credential;
      });
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.card}>
        <Box className={classes.containerLogo}>
          <img alt="Logo" src={LogoImg} className={classes.logo} />
          <Typography className={classes.title} component="span" variant="h3">
            Lanchos
          </Typography>
        </Box>
        <Box>
          <Button
            onClick={() => loginHandler(provider)}
            className={classes.btn}
          >
            <img src={LogoGoogle} alt="" className={classes.googleLogo} />
            <span>Log in with Google</span>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginFormNew;

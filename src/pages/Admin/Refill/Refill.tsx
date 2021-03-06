/* eslint-disable guard-for-in */
import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { hideLoader, showLoader, showSnackBar, StatusTypes } from 'store/app';
import { useFormik } from 'formik';
import * as yup from 'yup';
import firebase from 'firebase/app';
import firebaseInstance, { Collections } from 'utils/firebase';
import {
  Box,
  Container,
  TextField,
  Select,
  Button,
  Theme,
  createStyles,
  makeStyles,
  Breadcrumbs,
} from '@material-ui/core';
import dayjs from 'utils/dayjs';
import { colors } from 'utils/colors';

import { UserNew } from 'entities/User';

import { fetchAllUsers, getAllUserSelector } from 'store/users';
import { getDepositModeSelector } from 'store/settings';

import Ruble from 'components/Ruble';
import AdminLayout from '../../../components/AdminComponents/Layout/AdminLayout';

const userCollection = firebaseInstance.collection(Collections.Users);
const refillCollection = firebaseInstance.collection(Collections.Refill);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: '#000',
    },
    fieldBox: {
      position: 'relative',
    },
    textField: {
      marginBottom: 20,
    },
    selectField: {
      marginBottom: 40,
      position: 'relative',
    },
    fieldError: {
      width: '100%',
      position: 'absolute',
      top: 58,
      left: 15,
      fontSize: 12,
      color: colors.red,
    },
    formControl: {
      margin: theme.spacing(1),
      width: '100%',
    },
    formBlock: {
      width: 320,
      marginTop: 40,
    },
  }),
);

const Refill: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const users = useSelector(getAllUserSelector);
  const depositMode = useSelector(getDepositModeSelector);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch]);

  if (!depositMode) {
    window.location.href = '/admin';
  }

  const validationSchema = yup.object({
    user: yup.string().required('???????????????????? ?????????????? ????????????????????????'),
    summa: yup
      .number()
      .typeError('???????? ?????????? ???????????????? ????????????????')
      .required('???????????????????? ?????????????????? ????????'),
  });

  const formik = useFormik({
    initialValues: {
      user: '',
      summa: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(showLoader());

        const refill = {
          date: firebase.firestore.Timestamp.fromDate(dayjs().toDate()),
          amount: values.summa,
          user: firebaseInstance.doc(`${Collections.Users}/${values.user}`),
        };

        await userCollection
          .doc(values.user)
          .update({ balance: userBalance + values.summa });
        await refillCollection.add(refill);
        await dispatch(fetchAllUsers());

        formik.resetForm();

        await dispatch(hideLoader());
        await dispatch(
          showSnackBar({
            status: StatusTypes.success,
            message: '???????????? ????????????????',
          }),
        );
      } catch (e) {
        console.log(e);
      }
    },
  });

  const updateCurrentBalance = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const currentBalance = users.find(
      (el: UserNew) => el.id === event.target.value,
    );
    setUserBalance(currentBalance ? currentBalance.balance : 0);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>???????????????????? ??????????????</title>
      </Helmet>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        <Container>
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/admin/dishes" className={classes.link}>
              ???????????????????? ??????????????
            </Link>
          </Breadcrumbs>
          <form
            onSubmit={formik.handleSubmit}
            className={classes.formBlock}
            autoComplete="off"
          >
            <Box className={classes.selectField}>
              <Select
                native
                value={formik.values.user}
                onChange={(event) => {
                  formik.handleChange(event);
                  updateCurrentBalance(event);
                }}
                onBlur={formik.handleBlur}
                variant="outlined"
                fullWidth
                inputProps={{
                  name: 'user',
                }}
                error={formik.touched.user && Boolean(formik.errors.user)}
              >
                <option value="">???????????????? ????????????????????????</option>
                {users.length
                  ? users.map((el: UserNew) => (
                      <option
                        value={el.id}
                      >{`${el.name} (${el.email})`}</option>
                    ))
                  : null}
              </Select>
              <span className={classes.fieldError}>
                {formik.touched.user && formik.errors.user}
              </span>
              {formik.values.user ? (
                <p>
                  {`?????????????? ???????????? - ${userBalance}`}
                  <Ruble />
                </p>
              ) : null}
            </Box>
            <Box className={classes.textField}>
              <Box className={classes.fieldBox}>
                <TextField
                  type="number"
                  value={formik.values.summa}
                  onChange={formik.handleChange}
                  error={formik.touched.summa && Boolean(formik.errors.summa)}
                  name="summa"
                  classes={{ root: classes.textField }}
                  fullWidth
                  autoComplete="off"
                  label="?????????? ????????????????????"
                  variant="outlined"
                />
                <span className={classes.fieldError}>
                  {formik.touched.summa && formik.errors.summa}
                </span>
              </Box>
            </Box>
            <Button
              fullWidth
              color="primary"
              type="submit"
              disabled={formik.isSubmitting}
            >
              ??????????????????
            </Button>
          </form>
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default Refill;

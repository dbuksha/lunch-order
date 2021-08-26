/* eslint-disable guard-for-in */
import React, { FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import { addDish } from 'store/dishes';
import { hideLoader, showLoader, showSnackBar, StatusTypes } from 'store/app';
import { useFormik } from 'formik';
import * as yup from 'yup';
import firebaseInstance, { Collections } from 'utils/firebase';
import {
  Box,
  Container,
  TextField,
  Select,
  Typography,
  Button,
  Theme,
  createStyles,
  makeStyles,
  Breadcrumbs,
} from '@material-ui/core';

import Loader from '../../components/StyledLoader';
import AdminLayout from '../../components/AdminComponenets/Layout/AdminLayout';

interface IParamsURL {
  id?: string;
}

const dishesCollection = firebaseInstance.collection(Collections.Dishes);

const validationSchema = yup.object({
  name: yup.string().required('Необходимо заполнить поле'),
  price: yup
    .number()
    .typeError('Поле имеет числовое значение')
    .required('Необходимо заполнить поле'),
  weight: yup
    .number()
    .typeError('Поле имеет числовое значение')
    .required('Необходимо заполнить поле'),
});

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
      // margin: theme.spacing(2),
      marginBottom: 40,
    },
    selectField: {
      marginBottom: 40,
    },
    fieldError: {
      width: '100%',
      position: 'absolute',
      top: 58,
      left: 15,
      fontSize: 12,
      color: '#f44336',
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

const getCurrentTypePage = (params: IParamsURL) => {
  if (params && params.id) {
    return 'edit';
  }

  return 'new';
};

const DishesNew: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const paramsUrl = useParams() as IParamsURL;
  const [typePage, setTypePage] = useState(getCurrentTypePage(paramsUrl));
  const [loadingStatus, setLoadingStatus] = useState(false);

  const formik = useFormik({
    initialValues: {
      category: '',
      name: '',
      price: '',
      weight: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const newDish = {
        category: values.category,
        name: values.name,
        price: +values.price,
        weight: +values.weight,
      };

      try {
        await dispatch(showLoader());

        if (typePage === 'new') {
          await dishesCollection.add(newDish);
        } else {
          const { id } = paramsUrl;
          await dishesCollection.doc(id).update(newDish);
        }

        await dispatch(
          showSnackBar({
            status: StatusTypes.success,
            message:
              typePage === 'new'
                ? 'Новое блюдо успешно добавлено'
                : 'Изменения успешно сохранены',
          }),
        );

        await dispatch(hideLoader());

        if (typePage === 'new') {
          await history.push('/dishes');
        }
      } catch (e) {
        // TODO: handle an error
        console.log(e);
      }
    },
  });

  useEffect(() => {
    (async function () {
      setLoadingStatus(true);

      if (paramsUrl.id) {
        const currentDish = await dishesCollection.doc(paramsUrl.id).get();
        const result = currentDish.data();

        // eslint-disable-next-line no-restricted-syntax
        for (const key in result) {
          formik.setFieldValue(`${key}`, `${result[key]}`);
        }
      }
      setLoadingStatus(false);
    })();
  }, []);

  return (
    <AdminLayout>
      <Helmet>
        <title>
          {typePage === 'new'
            ? 'Добавление нового блюда'
            : 'Редактирование блюда'}
        </title>
      </Helmet>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        {loadingStatus ? (
          <Loader />
        ) : (
          <Container>
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/dishes" className={classes.link}>
                Список блюд
              </Link>
              <Typography variant="body1">
                {typePage === 'new'
                  ? 'Добавление нового блюда'
                  : formik.values.name}
              </Typography>
            </Breadcrumbs>
            <form
              onSubmit={formik.handleSubmit}
              className={classes.formBlock}
              autoComplete="off"
            >
              <Box className={classes.selectField}>
                <Select
                  native
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    name: 'category',
                  }}
                >
                  <option value="main">Главное блюдо</option>
                  <option value="soup">Певрое блюдо</option>
                  <option value="side">Гарнир</option>
                  <option value="salad">Салат</option>
                  <option value="dessert">Десерт</option>
                </Select>
              </Box>
              <Box className={classes.fieldBox}>
                <TextField
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  name="name"
                  classes={{ root: classes.textField }}
                  fullWidth
                  autoComplete="off"
                  label="Название блюда"
                  variant="outlined"
                />
                <span className={classes.fieldError}>
                  {formik.touched.name && formik.errors.name}
                </span>
              </Box>
              <Box className={classes.fieldBox}>
                <TextField
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  name="price"
                  classes={{ root: classes.textField }}
                  fullWidth
                  autoComplete="off"
                  label="Цена (руб.)"
                  variant="outlined"
                />
                <span className={classes.fieldError}>
                  {formik.touched.price && formik.errors.price}
                </span>
              </Box>
              <Box className={classes.fieldBox}>
                <TextField
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  error={formik.touched.weight && Boolean(formik.errors.weight)}
                  name="weight"
                  classes={{ root: classes.textField }}
                  fullWidth
                  autoComplete="off"
                  label="Вес (гр.)"
                  variant="outlined"
                />
                <span className={classes.fieldError}>
                  {formik.touched.weight && formik.errors.weight}
                </span>
              </Box>
              <Button fullWidth color="primary" type="submit">
                {typePage === 'new' ? 'Добавить' : 'Сохранить'}
              </Button>
            </form>
          </Container>
        )}
      </Box>
    </AdminLayout>
  );
};

export default DishesNew;

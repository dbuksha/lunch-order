import React, { FC } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  FormControl,
  TextField,
  Typography,
  Button,
  Theme,
  createStyles,
  makeStyles,
  Breadcrumbs,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';

import AdminLayout from '../../components/AdminComponenets/Layout/AdminLayout';

const validationSchema = yup.object({
  name: yup.string().required('Необходимо заполнить поле'),
  cost: yup
    .number()
    .typeError('Должно быть числом')
    .required('Необходимо заполнить поле'),
  weight: yup
    .number()
    .typeError('Должно быть числом')
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

const DishesEdit: FC = () => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      name: 'Куриная лапша',
      cost: 60,
      weight: 300,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // dispatch(addUser(values));
    },
  });

  return (
    <AdminLayout>
      <Helmet>
        <title>Редактирование блюда</title>
      </Helmet>
      <Box
        sx={{
          // backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        <Container className="">
          {/* <Typography variant="h6">Страница редактирования блюда</Typography> */}
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/dishes" className={classes.link}>
              Список блюд
            </Link>
            <Typography variant="body1">Куриная лапша</Typography>
          </Breadcrumbs>
          <form
            onSubmit={formik.handleSubmit}
            className={classes.formBlock}
            autoComplete="off"
          >
            <Box className={classes.fieldBox}>
              <TextField
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                // helperText={formik.touched.name && formik.errors.name}
                name="name"
                classes={{ root: classes.textField }}
                fullWidth
                // placeholder="Название блюда"
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
                value={formik.values.cost}
                onChange={formik.handleChange}
                error={formik.touched.cost && Boolean(formik.errors.cost)}
                // helperText={formik.touched.cost && formik.errors.cost}
                name="cost"
                classes={{ root: classes.textField }}
                fullWidth
                // placeholder="Цена (руб.)"
                autoComplete="off"
                label="Цена (руб.)"
                variant="outlined"
              />
              <span className={classes.fieldError}>
                {formik.touched.cost && formik.errors.cost}
              </span>
            </Box>
            <Box className={classes.fieldBox}>
              <TextField
                value={formik.values.weight}
                onChange={formik.handleChange}
                error={formik.touched.weight && Boolean(formik.errors.weight)}
                // helperText={formik.touched.weight && formik.errors.weight}
                name="weight"
                classes={{ root: classes.textField }}
                fullWidth
                // placeholder="Вес (гр.)"
                autoComplete="off"
                label="Вес (гр.)"
                variant="outlined"
              />
              <span className={classes.fieldError}>
                {formik.touched.weight && formik.errors.weight}
              </span>
            </Box>
            <Button fullWidth color="primary" type="submit">
              Сохранить
            </Button>
          </form>
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default DishesEdit;

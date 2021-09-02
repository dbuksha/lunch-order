/* eslint-disable guard-for-in */
import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Autocomplete from '@material-ui/lab/Autocomplete';
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

import { Lunch } from 'entities/Lunch';
import { Dish } from 'entities/Dish';
import { getDishesList } from 'store/dishes';
import { fetchLunches } from 'store/lunches';
import Loader from '../../components/StyledLoader';
import AdminLayout from '../../components/AdminComponenets/Layout/AdminLayout';

interface IParamsURL {
  id?: string;
}

const complexCollection = firebaseInstance.collection(Collections.Lunches);

const validationSchema = yup.object({
  name: yup.string().required('Необходимо заполнить поле'),
  day: yup.string().required('Необходимо заполнить поле'),
  multiDishes: yup.array().required('Необходимо заполнить поле'),
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

const ComplexNewEdit: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const paramsUrl = useParams() as IParamsURL;
  const [typePage] = useState(getCurrentTypePage(paramsUrl));
  const [loadingStatus, setLoadingStatus] = useState(false);
  const dishes = useSelector(getDishesList);
  const [dishComplex, setDishComplex] = useState<Dish[]>([]);

  const formik = useFormik({
    initialValues: {
      name: '',
      day: '1',
      multiDishes: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      const dishRefs = values.multiDishes.map((el: Lunch) => {
        return firebaseInstance.doc(`${Collections.Dishes}/${el.id}`);
      });

      const complex = {
        name: values.name,
        dayNumber: +values.day,
        dishes: dishRefs,
      };

      try {
        await dispatch(showLoader());
        if (typePage === 'new') {
          await complexCollection.add(complex);
        } else {
          const { id } = paramsUrl;
          await complexCollection.doc(id).update(complex);
        }
        await dispatch(
          showSnackBar({
            status: StatusTypes.success,
            message:
              typePage === 'new'
                ? 'Новый комплекс успешно добавлен'
                : 'Изменения успешно сохранены',
          }),
        );
        await dispatch(hideLoader());
        await dispatch(fetchLunches());
        if (typePage === 'new') {
          await history.push('/complexes');
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  useEffect(() => {
    (async function () {
      setLoadingStatus(true);

      if (paramsUrl.id) {
        const currentComplex = await complexCollection.doc(paramsUrl.id).get();
        const result = currentComplex.data();

        if (result) {
          formik.setFieldValue('name', `${result.name}`);
          formik.setFieldValue('day', `${result.dayNumber}`);

          const arrDishes: Dish[] = [];

          dishes.forEach((el) => {
            result.dishes.forEach((item: { id: string }) => {
              if (el.id === item.id) {
                arrDishes.push(el);
              }
            });
          });

          setDishComplex(arrDishes);
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
            ? 'Добавление нового комплекса'
            : 'Редактирование компелкса'}
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
              <Link to="/complexes" className={classes.link}>
                Список комплексов
              </Link>
              <Typography variant="body1">
                {typePage === 'new'
                  ? 'Добавление нового комплекса'
                  : formik.values.name || 'Редактирование комплекса'}
              </Typography>
            </Breadcrumbs>
            <form
              onSubmit={formik.handleSubmit}
              className={classes.formBlock}
              autoComplete="off"
            >
              <Box className={classes.textField}>
                <Box className={classes.fieldBox}>
                  <TextField
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    name="name"
                    fullWidth
                    autoComplete="off"
                    label="Название комплекса"
                    variant="outlined"
                  />
                  <span className={classes.fieldError}>
                    {formik.touched.name && formik.errors.name}
                  </span>
                </Box>
              </Box>
              <Box className={classes.selectField}>
                <Select
                  native
                  value={formik.values.day}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    name: 'day',
                  }}
                >
                  <option value="1">Понедельник</option>
                  <option value="2">Вторник</option>
                  <option value="3">Среда</option>
                  <option value="4">Четверг</option>
                  <option value="5">Пятница</option>
                </Select>
              </Box>
              <Box className={classes.selectField}>
                <Autocomplete
                  multiple
                  options={dishes}
                  defaultValue={typePage === 'new' ? [] : dishComplex}
                  getOptionLabel={(option) => option.name}
                  onChange={(
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    event: {},
                    value: any,
                  ): void => {
                    formik.setFieldValue('multiDishes', value);
                  }}
                  onOpen={formik.handleBlur}
                  includeInputInList
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(
                        formik.touched.multiDishes && formik.errors.multiDishes,
                      )}
                      fullWidth
                      helperText={
                        formik.touched.multiDishes && formik.errors.multiDishes
                      }
                      label="Список блюд"
                      name="multiDishes"
                      variant="outlined"
                    />
                  )}
                />
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

export default ComplexNewEdit;

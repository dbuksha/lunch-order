import React, { FC } from 'react';
import {
  TextField,
  Button,
  createStyles,
  makeStyles,
  Theme,
  FormControl,
  Container,
  InputLabel,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';

import { addUser } from 'store/users';
import NumberFormat from 'react-number-format';

const validationSchema = yup.object({
  name: yup.string().required('is required'),
  phone: yup.string(),
});

const initialValues = {
  name: '',
  phone: '',
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      margin: theme.spacing(1),
    },
    formControl: {
      margin: theme.spacing(1),
      width: '100%',
    },
  }),
);

const LoginForm: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      dispatch(addUser(values));
    },
  });

  return (
    <Container maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <TextField
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          name="name"
          classes={{ root: classes.textField }}
          required
          fullWidth
          placeholder="Имя"
        />

        <FormControl classes={{ root: classes.formControl }}>
          <NumberFormat
            value={formik.values.phone}
            id="phoneInput"
            placeholder="Телефон"
            customInput={TextField}
            onValueChange={(val) =>
              formik.setFieldValue('phone', val.floatValue)
            }
            format="+7 (###) ###-####"
          />
        </FormControl>

        <Button fullWidth color="primary" type="submit">
          Sign In
        </Button>
      </form>
    </Container>
  );
};

export default LoginForm;

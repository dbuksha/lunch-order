import React, { FC } from 'react';
import {
  TextField,
  Button,
  createStyles,
  makeStyles,
  Theme,
  Input,
  FormControl,
  InputLabel,
  Container,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';

import { addUser } from 'store/users';
import { InputMask } from 'components/MaskedInput';

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
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
      },
      '& .MuiFormControl-root': {
        margin: theme.spacing(1),
        width: '100%',
      },
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
      <form className={classes.root} onSubmit={formik.handleSubmit}>
        <TextField
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          name="name"
          required
          fullWidth
          label="Имя"
        />

        <FormControl>
          <InputLabel htmlFor="phoneInput">Телефон</InputLabel>
          <Input
            value={formik.values.phone}
            onChange={formik.handleChange}
            name="phone"
            id="phoneInput"
            inputComponent={InputMask as any}
            fullWidth
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

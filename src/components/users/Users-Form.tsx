import React, { FC } from 'react';
import {
  TextField,
  Button,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';

import { addUser } from 'store/users';

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
    },
  }),
);

const UsersForm: FC = () => {
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
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <TextField
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        name="name"
        required
        fullWidth
        label="Name"
      />
      <TextField
        value={formik.values.phone}
        onChange={formik.handleChange}
        error={formik.touched.phone && Boolean(formik.errors.phone)}
        helperText={formik.touched.phone && formik.errors.phone}
        name="phone"
        label="Phone"
        fullWidth
      />
      <Button fullWidth color="primary" type="submit">
        Sign In
      </Button>
    </form>
  );
};

export default UsersForm;

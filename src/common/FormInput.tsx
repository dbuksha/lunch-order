import React, { FC } from 'react';
import { TextField } from '@material-ui/core';
import { useController } from 'react-hook-form';

export const FormInput: FC = () => {
  // const {
  //   field: { ref, ...inputProps },
  //   fieldState: { props.invalid, props.isTouched, props.isDirty },
  //   formState: { touchedFields, dirtyFields }
  // } = useController({
  //   name,
  //   control,
  //   rules: { required: true },
  //   defaultValue: "",
  // });

  return <TextField />;
};

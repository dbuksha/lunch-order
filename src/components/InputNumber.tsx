import React, { FC } from 'react';
import {
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles({
  textField: {
    textAlign: 'center',
    margin: 0,
    '& input': {
      minWidth: '1em',
      maxWidth: '2em',
      textAlign: 'center',
    },
    '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
  },
  iconButton: {
    fontSize: '1em',
  },
  inputAdornment: {
    margin: 0,
  },
});

type InputNumberProps = {
  disabled: boolean;
  min: number;
  value: number;
  onChange: (val: number) => void;
};

const InputNumber: FC<InputNumberProps> = ({
  disabled,
  min,
  value,
  onChange,
}) => {
  const classes = useStyles();

  const onAdd = () => {
    onChange(value + 1);
  };
  const onRemove = () => {
    if (value > 1) onChange(value - 1);
  };

  return (
    <TextField
      className={classes.textField}
      id="standard-start-adornment"
      type="number"
      disabled={disabled}
      value={value}
      onChange={({ target: { value } }) => onChange(Number(value))}
      InputProps={{
        inputProps: { min },
        disableUnderline: true,
        startAdornment: (
          <InputAdornment position="start" className={classes.inputAdornment}>
            <IconButton size="small" disabled={disabled} onClick={onRemove}>
              <RemoveIcon className={classes.iconButton} />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end" className={classes.inputAdornment}>
            <IconButton
              aria-label="delete"
              size="small"
              disabled={disabled}
              onClick={onAdd}
            >
              <AddIcon className={classes.iconButton} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default InputNumber;

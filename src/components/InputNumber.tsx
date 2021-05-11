import React, { ChangeEvent, FC } from 'react';
import {
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { UpdateQuantityAction } from 'store/orders';

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
  onChange: (type: UpdateQuantityAction) => void;
};

const InputNumber: FC<InputNumberProps> = ({
  disabled,
  min,
  value,
  onChange,
}) => {
  const classes = useStyles();

  const onAdd = () => {
    onChange(UpdateQuantityAction.ADD);
  };
  const onRemove = () => {
    if (value > 1) onChange(UpdateQuantityAction.REMOVE);
  };

  const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    const actionType =
      value < newValue ? UpdateQuantityAction.ADD : UpdateQuantityAction.REMOVE;
    onChange(actionType);
  };

  return (
    <TextField
      className={classes.textField}
      id="standard-start-adornment"
      type="number"
      disabled={disabled}
      value={value}
      onChange={handleUpdate}
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

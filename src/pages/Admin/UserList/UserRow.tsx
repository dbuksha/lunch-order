import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import firebaseInstance, { Collections } from 'utils/firebase';
import {
  Avatar,
  Box,
  Button,
  TableRow,
  TableCell,
  Select,
  TextField,
  Typography,
  makeStyles,
  createStyles,
} from '@material-ui/core';

import { UserNew } from 'entities/User';

import { formatCurrency } from 'utils/orders/calculateDishesPrice';
import { showSnackBar } from 'store/app';

import SaveIcon from '@material-ui/icons/Save';

import Ruble from 'components/Ruble';

const useStyles = makeStyles(() =>
  createStyles({
    user: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      marginRight: 8,
    },
    adminAvatar: {
      marginRight: 8,
      border: '2px solid #3f51b5',
    },
    slackBlock: {
      display: 'flex',
      alignItems: 'center',
    },
    saveBtn: {
      width: 40,
      height: 40,
      minWidth: 40,
    },
  }),
);

interface Props {
  user: UserNew;
  admin: boolean;
  depositMode: boolean;
}

const usersCollection = firebaseInstance.collection(Collections.Users);

const UserRow: FC<Props> = ({ user, admin, depositMode }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [slackID, setSlackID] = useState(user.slack_id || '');
  const [role, setRole] = useState(user.role || 'user');

  const changeRole = (role: string) => {
    setRole(role);
    usersCollection.doc(user.id).update({ role });
  };

  const changeSlackID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlackID(event.target.value);
  };

  const saveSlackID = () => {
    usersCollection.doc(user.id).update({ slack_id: slackID });
    dispatch(
      showSnackBar({
        status: 'success',
        message: 'Slack name успешно изменено!',
      }),
    );
  };

  return (
    <TableRow>
      <TableCell>{user.id}</TableCell>
      <TableCell>
        <Box className={classes.user}>
          <Avatar
            src={user.avatar!}
            className={role === 'admin' ? classes.adminAvatar : classes.avatar}
          />
          <Typography color="textPrimary" variant="body2">
            {user.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      {depositMode ? (
        <TableCell>
          {formatCurrency(user.balance)}
          <Ruble />
        </TableCell>
      ) : null}
      <TableCell>
        <Box className={classes.slackBlock}>
          <TextField
            variant="outlined"
            label="Slack ID"
            defaultValue={slackID || ''}
            onChange={changeSlackID}
          />
          <Button
            className={classes.saveBtn}
            onClick={saveSlackID}
            disabled={slackID === user.slack_id}
          >
            <SaveIcon
              color={slackID === user.slack_id ? 'disabled' : 'primary'}
            />
          </Button>
        </Box>
      </TableCell>
      <TableCell>
        <Select
          native
          value={role}
          onChange={(event) => changeRole(`${event.target.value}`)}
          variant="outlined"
          fullWidth
          inputProps={{
            name: 'role',
          }}
          disabled={admin}
        >
          <option value="user">Пользователь</option>
          <option value="admin">Администратор</option>
        </Select>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;

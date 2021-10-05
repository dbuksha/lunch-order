import React, { FC, useState } from 'react';
import firebaseInstance, { Collections } from 'utils/firebase';
import {
  Avatar,
  Box,
  TableRow,
  TableCell,
  Select,
  Typography,
  makeStyles,
  createStyles,
} from '@material-ui/core';

import { UserNew } from 'entities/User';
import Ruble from 'components/Ruble';

import { numberWithSpaces } from 'utils/orders/calculateDishesPrice';

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
  }),
);

interface Props {
  user: UserNew;
  admin: boolean;
}

const usersCollection = firebaseInstance.collection(Collections.Users);

const UserRow: FC<Props> = ({ user, admin }) => {
  const classes = useStyles();
  const [role, setRole] = useState(user.role || 'user');

  const changeRole = (role: string) => {
    setRole(role);
    usersCollection.doc(user.id).update({ role });
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
      <TableCell>
        {numberWithSpaces(user.balance)}
        <Ruble />
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
          <option value="admin">Админ</option>
        </Select>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;

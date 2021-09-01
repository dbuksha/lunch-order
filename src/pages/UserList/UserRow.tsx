import React, { FC, useEffect, useState } from 'react';
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

const useStyles = makeStyles(() =>
  createStyles({
    user: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      marginRight: 4,
    },
  }),
);

interface Props {
  user: UserNew;
}

const UserRow: FC<Props> = ({ user }) => {
  const classes = useStyles();
  const [role, setRole] = useState(user.role || 'user');

  useEffect(() => {});

  return (
    <TableRow>
      <TableCell>{user.id}</TableCell>
      <TableCell>
        <Box className={classes.user}>
          <Avatar src={user.avatar!} className={classes.avatar} />
          <Typography color="textPrimary" variant="body2">
            {user.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Select
          native
          value={role}
          onChange={(event) => {
            console.log(event.target.value);
            setRole(`${event.target.value}`);
          }}
          variant="outlined"
          fullWidth
          inputProps={{
            name: 'role',
          }}
        >
          <option value="user">Пользователь</option>
          <option value="admin">Админ</option>
        </Select>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;

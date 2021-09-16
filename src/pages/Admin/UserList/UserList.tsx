import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@material-ui/core';

import { UserNew } from 'entities/User';

import {
  fetchAllUsers,
  getAllUserSelector,
  getUserSelector,
} from 'store/users';

import AdminLayout from '../../../components/AdminComponents/Layout/AdminLayout';
import UserRow from './UserRow';

const UserList: FC = () => {
  const dispatch = useDispatch();
  const users = useSelector(getAllUserSelector);
  const currentUser = useSelector(getUserSelector);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <AdminLayout>
      <Helmet>
        <title>Пользователи</title>
      </Helmet>
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">Список пользователей</Typography>
          </Box>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>ID</b>
                  </TableCell>
                  <TableCell>
                    <b>ФИО</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell>
                    <b>Роль</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users &&
                  currentUser &&
                  users.map((el: UserNew) => (
                    <UserRow
                      user={el}
                      key={el.id}
                      admin={currentUser.email === el.email}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default UserList;

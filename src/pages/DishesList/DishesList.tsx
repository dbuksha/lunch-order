import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Alert, Pagination } from '@material-ui/lab';
import firebaseInstance, { Collections } from 'utils/firebase';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  SvgIcon,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { Search as SearchIcon } from 'react-feather';

import { Dish } from 'entities/Dish';

import { fetchDishes, getDishesList } from 'store/dishes';
import { getIsLoading } from 'store/app';

import AdminLayout from '../../components/AdminComponenets/Layout/AdminLayout';
import DishCard from '../../components/AdminComponenets/Cards/DishCard';

const perPage = 12;
const minLenghtSeach = 3;

const dishesCollection = firebaseInstance.collection(Collections.Dishes);

// const renderDish = (dish: Dish) => {
//   return (
//     <Grid item key={dish.id} lg={3} md={6} xs={12}>
//       <DishCard data={dish} />
//     </Grid>
//   );
// };

const getTotalpage = (arr: Dish[]) => {
  return +(arr.length / perPage).toFixed();
};

const getCurrentDishes = (arr: Dish[], currentPage: number) => {
  const begin = (currentPage - 1) * perPage;
  const end = begin + perPage;
  return arr.slice(begin, end);
};

const getSearchData = (arr: Dish[], search: string) => {
  const resultArr: Dish[] = [];

  arr.forEach((el) => {
    if (el.name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
      resultArr.push(el);
    }
  });

  return resultArr;
};

const Dashboard: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const dishes = useSelector(getDishesList);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(getTotalpage(dishes));
  const [currentDishes, setCurrentDishes] = useState(
    getCurrentDishes(dishes, page),
  );
  const [searchStatus, setSearchStatus] = useState(false);
  const [searchStr, setSearchStr] = useState('');

  const deleteDishHandler = (id: string) => {
    dishesCollection.doc(id).delete();

    // update local list
    const newCurrentDishes: Dish[] = [];

    currentDishes.forEach((el) => {
      if (el.id !== id) {
        newCurrentDishes.push(el);
      }
    });

    // testing!!!
    dispatch(fetchDishes());
    setCurrentDishes(newCurrentDishes);
  };

  useEffect(() => {
    dispatch(fetchDishes());
  }, [dispatch]);

  useEffect(() => {
    if (searchStr !== '') {
      setPage(1);
      setTotal(getTotalpage(currentDishes));
    }
  }, [currentDishes]);

  return (
    <AdminLayout>
      <Helmet>
        <title>Список блюд</title>
      </Helmet>
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          {!dishes.length && !isLoading ? (
            <Alert variant="outlined" severity="info">
              Список блюд отсутствует
            </Alert>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">Список блюд</Typography>
                <Button
                  component={Link}
                  to="/dishes-new"
                  variant="contained"
                  color="primary"
                >
                  Добавить
                </Button>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardContent
                    style={{ position: 'relative', display: 'flex' }}
                  >
                    <Box sx={{ maxWidth: 400 }}>
                      <TextField
                        style={{ width: 300 }}
                        value={searchStr}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SvgIcon fontSize="small" color="action">
                                <SearchIcon />
                              </SvgIcon>
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Поиск блюда"
                        variant="outlined"
                        onChange={(event) => setSearchStr(event.target.value)}
                        onKeyPress={(event) => {
                          if (event.key === 'Enter') {
                            if (searchStr.length >= minLenghtSeach) {
                              setSearchStatus(true);
                              setCurrentDishes(
                                getSearchData(dishes, searchStr),
                              );
                            }
                          }
                        }}
                      />
                    </Box>
                    {searchStr !== '' ? (
                      <Button
                        style={{
                          width: 20,
                          minWidth: 30,
                          height: 30,
                          padding: 0,
                          background: '#fff',
                          position: 'absolute',
                          top: 30,
                          left: 280,
                        }}
                        onClick={() => {
                          // setPage(1);
                          // setTotal(getTotalpage(dishes));
                          // setCurrentDishes(getCurrentDishes(dishes, page));
                          // setSearchStatus(false);
                          setSearchStr('');
                        }}
                      >
                        <ClearIcon />
                      </Button>
                    ) : null}
                    {searchStatus ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          setPage(1);
                          setTotal(getTotalpage(dishes));
                          setCurrentDishes(getCurrentDishes(dishes, page));
                          setSearchStatus(false);
                          setSearchStr('');
                        }}
                        style={{ marginLeft: 20 }}
                      >
                        Сбросить
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ pt: 3 }}>
                {currentDishes.length ? (
                  <Grid container spacing={3}>
                    {currentDishes.map((el) => (
                      <Grid item key={el.id} lg={3} md={6} xs={12}>
                        <DishCard data={el} deleteDish={deleteDishHandler} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <p>По результатам поиска ничего не найдено</p>
                )}
              </Box>
              {total > 1 ? (
                <Box display="flex" justifyContent="flex-end" sx={{ pt: 3 }}>
                  <Pagination
                    count={total}
                    page={page}
                    onChange={(
                      event: React.ChangeEvent<unknown>,
                      page: number,
                    ): void => {
                      setPage(page);
                      setCurrentDishes(getCurrentDishes(dishes, page));
                      window.scrollTo(0, 0);
                    }}
                  />
                </Box>
              ) : null}
            </>
          )}
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default Dashboard;

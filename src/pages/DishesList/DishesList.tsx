import React, {
  ChangeEvent,
  FC,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
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
  createStyles,
  makeStyles,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { Search as SearchIcon } from 'react-feather';

import { Dish } from 'entities/Dish';

import { fetchDishes, getDishesList } from 'store/dishes';
import { getIsLoading } from 'store/app';

import AdminLayout from '../../components/AdminComponents/Layout/AdminLayout';
import DishCard from '../../components/AdminComponents/Cards/DishCard';

const perPage = 12;
const minLengthSearch = 3;

const dishesCollection = firebaseInstance.collection(Collections.Dishes);

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      display: 'flex',
      position: 'relative',
    },
    fieldSearch: {
      width: 300,
    },
    clearBtn: {
      width: 20,
      minWidth: 30,
      height: 30,
      padding: 0,
      background: '#fff',
      position: 'absolute',
      top: 30,
      left: 280,
    },
    resetBtn: {
      marginLeft: 20,
    },
  }),
);

const useQueryParams = () => {
  const { search } = useLocation();

  const page = Number(new URLSearchParams(search).get('page')) || 1;
  const dish = new URLSearchParams(search).get('dish') || '';

  return {
    page,
    dish,
    dishStatus: dish !== '',
  };
};

const getTotalpage = (arr: Dish[]) => {
  return +(arr.length / perPage).toFixed();
};

const getCurrentDishes = (
  arr: Dish[],
  currentPage: number,
  searcStr: string,
) => {
  const begin = (currentPage - 1) * perPage;
  const end = begin + perPage;

  if (searcStr !== '') {
    const resultArr = arr.filter(
      (el: Dish) =>
        el.name.toLowerCase().indexOf(searcStr.toLowerCase()) !== -1,
    );

    return resultArr;
  }

  return arr.slice(begin, end);
};

const Dashboard: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const dishes = useSelector(getDishesList);
  const { page: initialPage, dish: initialDish, dishStatus } = useQueryParams();
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(getTotalpage(dishes));
  const [searchStatus, setSearchStatus] = useState(dishStatus);
  const [searchStr, setSearchStr] = useState(initialDish);

  const [currentDishes, setCurrentDishes] = useState(
    getCurrentDishes(dishes, page, searchStr),
  );

  useEffect(() => {
    dispatch(fetchDishes());
  }, [dispatch]);

  useEffect(() => {
    if (searchStr !== '') {
      setPage(1);
      setTotal(getTotalpage(currentDishes));
    }
  }, [currentDishes]);

  const changeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchStr(event.target.value);
  };

  const deleteDishHandler = useCallback((id: string) => {
    dishesCollection.doc(id).delete();

    const newCurrentDishes: Dish[] = [];

    currentDishes.forEach((el) => {
      if (el.id !== id) {
        newCurrentDishes.push(el);
      }
    });

    dispatch(fetchDishes());
    setCurrentDishes(newCurrentDishes);
  }, []);

  const changePageHandler = async (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    await setPage(page);
    await setCurrentDishes(getCurrentDishes(dishes, page, searchStr));
    window.scrollTo(0, 0);
    history.push(
      `/admin/dishes?page=${page}${searchStatus ? `&dish=${searchStr}` : ''}`,
    );
  };

  const searchDishHandler = (event: { key: string }) => {
    if (event.key === 'Enter') {
      if (searchStr.length >= minLengthSearch) {
        setSearchStatus(true);
        setCurrentDishes(getCurrentDishes(dishes, page, searchStr));
        history.push(`/admin/dishes?dish=${searchStr}`);
      }
    }
  };

  const resetSearch = () => {
    setPage(1);
    setTotal(getTotalpage(dishes));
    setSearchStatus(false);
    setSearchStr('');
    setCurrentDishes(getCurrentDishes(dishes, 1, ''));
    history.push('/admin/dishes');
  };

  const clearFieldSearch = () => {
    setSearchStr('');
  };

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
                  to="/admin/dishes-new"
                  variant="contained"
                  color="primary"
                >
                  Добавить
                </Button>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardContent className={classes.card}>
                    <Box sx={{ maxWidth: 400 }}>
                      <TextField
                        className={classes.fieldSearch}
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
                        onChange={changeSearchValue}
                        onKeyPress={searchDishHandler}
                      />
                    </Box>
                    {searchStr !== '' ? (
                      <Button
                        className={classes.clearBtn}
                        onClick={clearFieldSearch}
                      >
                        <ClearIcon />
                      </Button>
                    ) : null}
                    {searchStatus ? (
                      <Button
                        className={classes.resetBtn}
                        variant="contained"
                        onClick={resetSearch}
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
                    onChange={changePageHandler}
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

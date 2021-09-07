import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  createStyles,
  makeStyles,
} from '@material-ui/core';

import { Dish } from 'entities/Dish';

import DeleteIcon from '@material-ui/icons/Delete';
import DeleteAlert from '../Alerts/DeleteAlert';

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      height: '100%',
      paddingBottom: 80,
      position: 'relative',
    },
    link: {
      color: 'rgba(0, 0, 0, 0.5)',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    params: {
      paddingTop: 4,
    },
    blockEvents: {
      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
      position: 'absolute',
      right: 0,
      left: 0,
      bottom: 0,
    },
    containerEvents: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deleteBtn: {
      width: 40,
      minWidth: 40,
      height: 40,
    },
  }),
);

interface Props {
  data: Dish;
  deleteDish: (id: string) => void;
}

const DishesCard: FC<Props> = ({ data, deleteDish }) => {
  const classes = useStyles();
  const [dialogStatus, setDialogStatus] = useState(false);

  const changeDialog = (state: boolean) => () => setDialogStatus(state);

  const deleteDishHandler = () => {
    setDialogStatus(false);
    deleteDish(data.id);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography align="left" color="textPrimary" gutterBottom variant="h5">
          {data.name}
        </Typography>
        <Typography
          align="left"
          color="textPrimary"
          variant="body1"
          className={classes.params}
        >
          {`Цена: ${data.price} p.`}
        </Typography>
        <Typography
          align="left"
          color="textPrimary"
          variant="body1"
          className={classes.params}
        >
          {`Вес: ${data.weight} гр.`}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }} className={classes.blockEvents}>
        <Grid container spacing={1} className={classes.containerEvents}>
          <Grid item>
            <Link className={classes.link} to={`/dishes-edit/${data.id}`}>
              Редактировать
            </Link>
          </Grid>
          <Grid item>
            <Button className={classes.deleteBtn} onClick={changeDialog(true)}>
              <DeleteIcon color="error" />
            </Button>
          </Grid>
        </Grid>
      </Box>
      <DeleteAlert
        status={dialogStatus}
        title="Вы уверены, что хотите удалить данное блюдо?"
        desc="Данное блюдо будет навсегда удалено из базы данных и из комплексов, которые включали это блюдо."
        closeAlert={changeDialog(false)}
        confirmEvent={deleteDishHandler}
      />
    </Card>
  );
};

export default DishesCard;

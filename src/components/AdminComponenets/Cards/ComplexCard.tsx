import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import dayjs from 'dayjs';

import { Lunch } from 'entities/Lunch';

import DeleteIcon from '@material-ui/icons/Delete';
import DeleteDishAlert from '../Alerts/DeleteDishAlert';

interface Props {
  data: Lunch;
  deleteLunch: (id: string) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      color: 'rgba(0,0,0,.5)',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    params: {
      paddingTop: 4,
    },
    containerEvents: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    containerComplex: {
      display: 'flex',
      flexDirection: 'column',
    },
    deleteBtn: {
      width: 40,
      minWidth: 40,
      height: 40,
    },
  }),
);

const ComplexCard: FC<Props> = ({ data, deleteLunch }) => {
  const classes = useStyles();

  const dayName = dayjs()
    .weekday(data.dayNumber - 1)
    .format('dddd');

  const [dialogStatus, setDialogStatus] = useState(false);

  const openDialog = () => {
    setDialogStatus(true);
  };

  const closeDialog = () => {
    setDialogStatus(false);
  };

  const deleteDishHandler = () => {
    setDialogStatus(false);
    deleteLunch(data.id);
  };

  return (
    <Card>
      <CardContent>
        <Typography align="left" color="textPrimary" gutterBottom variant="h5">
          {`${data.name} - ${dayName}`}
        </Typography>
        <Box className={classes.containerComplex}>
          {data.dishes.map((el) => (
            <Box sx={{ pt: 2 }} display="flex" justifyContent="space-between">
              <Typography
                align="left"
                color="textPrimary"
                variant="body2"
                className={classes.params}
              >
                {el.name}
              </Typography>
              <Typography
                align="left"
                color="textPrimary"
                variant="body2"
                className={classes.params}
              >
                {`${el.weight}гр. / ${el.price}р.`}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1} className={classes.containerEvents}>
          <Grid item>
            <Link className={classes.link} to={`/complex-edit/${data.id}`}>
              Редактировать
            </Link>
          </Grid>
          <Grid item>
            <Button className={classes.deleteBtn} onClick={() => openDialog()}>
              <DeleteIcon color="error" />
            </Button>
          </Grid>
        </Grid>
      </Box>
      <DeleteDishAlert
        status={dialogStatus}
        title="Вы уверены, что хотите удалить данный комплекс?"
        desc="Данный компелкс будет навсегда удален из базы данных"
        closeAlert={closeDialog}
        confirmEvent={deleteDishHandler}
      />
    </Card>
  );
};

export default ComplexCard;

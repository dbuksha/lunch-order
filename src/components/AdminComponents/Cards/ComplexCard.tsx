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
import { colors } from 'utils/colors';

import { Lunch } from 'entities/Lunch';

import DeleteIcon from '@material-ui/icons/Delete';
import DeleteAlert from '../Alerts/DeleteAlert';

interface Props {
  data: Lunch;
  deleteLunch: (id: string) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      color: colors.mediumGray,
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

  const changeDialog = (state: boolean) => () => setDialogStatus(state);

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
            <Box
              sx={{ pt: 2 }}
              key={el.id}
              display="flex"
              justifyContent="space-between"
            >
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
                {`${el.weight}????. / ${el.price}??.`}
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
            <Link
              className={classes.link}
              to={`/admin/complex-edit/${data.id}`}
            >
              ??????????????????????????
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
        title="???? ??????????????, ?????? ???????????? ?????????????? ???????????? ?????????????????"
        desc="???????????? ???????????????? ?????????? ???????????????? ???????????? ???? ???????? ????????????"
        closeAlert={changeDialog(false)}
        confirmEvent={deleteDishHandler}
      />
    </Card>
  );
};

export default ComplexCard;

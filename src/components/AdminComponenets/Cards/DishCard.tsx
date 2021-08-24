import React, { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Dish } from 'entities/Dish';

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      color: 'rgba(0,0,0,.5)',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  }),
);

const style = { paddingTop: 4 };

interface Props {
  data: Dish;
}

const DishesCard: FC<Props> = ({ data }) => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography align="left" color="textPrimary" gutterBottom variant="h5">
          {data.name}
        </Typography>
        <Typography
          align="left"
          color="textPrimary"
          variant="body1"
          style={style}
        >
          {`Цена: ${data.price} p.`}
        </Typography>
        <Typography
          align="left"
          color="textPrimary"
          variant="body1"
          style={style}
        >
          {`Вес: ${data.weight} гр.`}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid item>
            <Link className={classes.link} to={`/dishes-edit/${data.id}`}>
              Редактировать
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default DishesCard;

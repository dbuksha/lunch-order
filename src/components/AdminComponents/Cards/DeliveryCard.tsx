import React, { FC } from 'react';
import {
  Avatar,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Chip,
  Box,
} from '@material-ui/core';
import AccountBalanceWalletOutlined from '@material-ui/icons/AccountBalanceWalletOutlined';
import { DeliveryData } from 'entities/Delivery';
import Ruble from 'components/Ruble';
import dayjs from 'utils/dayjs';
import { colors } from 'utils/colors';

type DeliveryCardProps = {
  delivery: DeliveryData;
};

const useStyles = makeStyles({
  main: {
    height: '100%',
    paddingBottom: 60,
    position: 'relative',
  },
  tableCell: {
    minWidth: 74,
    fontSize: 12,
    color: colors.mediumGray,
  },
  table: {
    width: '100%',
  },
  justifySpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  justifyFlexStart: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  resultContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `0 16px`,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  resultCost: {
    fontSize: 18,
  },
});

const DeliveryCard: FC<DeliveryCardProps> = ({ delivery }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.main}>
      <Toolbar className={classes.justifySpaceBetween}>
        {delivery && delivery.payer ? (
          <>
            <Box className={classes.justifyFlexStart}>
              {delivery.payer.avatar ? (
                <Avatar
                  src={delivery.payer.avatar}
                  className={classes.avatar}
                />
              ) : null}
              <Typography component="div" variant="subtitle1">
                {delivery.payer.name}
              </Typography>
              <AccountBalanceWalletOutlined color="action" />
            </Box>
          </>
        ) : null}
        <Chip
          label={dayjs(delivery.createDate.toMillis()).format('DD.MM.YYYY')}
          color="primary"
        />
      </Toolbar>
      <TableContainer>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell} align="left">
                Наименование
              </TableCell>
              <TableCell className={classes.tableCell} align="right">
                Кол-во
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {delivery.dishes.map(({ name, quantity }) => (
              <TableRow key={name}>
                <TableCell scope="row" align="left">
                  {name}
                </TableCell>
                <TableCell align="right">{quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className={classes.resultContainer}>
        <Box>
          <p className={classes.resultCost}>
            <b>
              Итого: {delivery.total}
              <Ruble />
            </b>
          </p>
        </Box>
      </Box>
    </Paper>
  );
};
export default DeliveryCard;

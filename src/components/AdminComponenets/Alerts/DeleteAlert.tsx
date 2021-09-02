import React, { FC } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  status: boolean;
  title: string;
  desc: string;
  closeAlert: () => void;
  confirmEvent: () => void;
}

const DeleteAlert: FC<Props> = ({
  status,
  title,
  desc,
  closeAlert,
  confirmEvent,
}) => {
  return (
    <div>
      <Dialog
        open={status}
        onClose={closeAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {desc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAlert} color="primary">
            Отменить
          </Button>
          <Button onClick={confirmEvent} color="primary">
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteAlert;

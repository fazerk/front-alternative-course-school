import * as React from 'react';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type props = {
    open: boolean,
    title: string,
    textContent: string,
    content: JSX.Element,
    handleAccept: () => void,
    handleClose: () => void
    
}

export default function FormDialog(props: props) {

  return (
    <div>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.textContent}
          </DialogContentText>
          {props.content}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancelar</Button>
          <Button onClick={props.handleAccept}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
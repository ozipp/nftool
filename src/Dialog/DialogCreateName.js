import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DialogCreateName(props) {
    const [text, setText] = useState("")

  /*const handleClickOpen = () => {
    props.setOpen(true);
  };*/

  const handleClose = () => {
    console.log("close dlg")
    props.setOpenDialog(false);
  };

  function textChange(event){
    setText(event.target.value);
}

  const handleCreate= () => {
    console.log("create close dlg");
    props.createLayer(text)
    props.setOpenDialog(false);
  };
/*<Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>*/
  return (
    <div>
      <Dialog open={props.openDialog} onClose={handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={props.content}
            value = {text}
            onChange={textChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
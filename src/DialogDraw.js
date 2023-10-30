import { useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './DialogWin.css';
import { useNavigate } from 'react-router-dom';

export default function DialogDraw() {
  const [open, setOpen]=useState(true);
  const navigate = useNavigate();

  function handleClickPlay(){
    setOpen(false);
    window.location.reload();
  }

  function handleClickExit(){
     setOpen(false);
     navigate('/exit',{state:{name:'exitnow'}});
  }

  return (
    <div className='dialog-box'>
      <Dialog
        open={open}
        onClose={()=>{setOpen(false)}}
      >
        <DialogTitle>
          <center className='dialog-title'>{"It's a Draw!!"}</center>
          </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <iframe src="https://giphy.com/embed/xb5LkPhSHUHIgHxW8J" width="300" height="100" className="giphy-embed" allowFullScreen></iframe>
            <br/><center className='play-again'>Do you want to play again?</center>
          </DialogContentText>
        </DialogContent>
        <div className = "btns">
          <Button id="yes-btn" onClick={handleClickPlay}>Yes</Button>
          <Button id="no-btn" onClick={handleClickExit}>No</Button>
        </div>
      </Dialog>
    </div>
  );
}

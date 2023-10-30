import { useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './DialogWin.css';
import { useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
import axios from 'axios';

export default function DialogWin({winner_name,player_name1,player_name2,player_id1,player_id2}) {
  const [open, setOpen]=useState(true);
  const [windowDimensions,setWindowDimensions]=useState({width:window.innerWidth,height:window.innerHeight});
  const navigate = useNavigate();


  function detectSize(){
    setWindowDimensions({width:window.innerWidth,height:window.innerHeight});
  }

  useEffect(()=>{
    window.addEventListener('resize',detectSize);
    return ()=>{
    window.removeEventListener('resize',detectSize);
  }
     },[windowDimensions]);

  const handleClickPlay=async()=>{
    setOpen(false);
    try{
      let response = await axios.post("http://localhost:5000/updatematches",{'player1':player_id1,'player2':player_id2});
      navigate('/game',{state:{name1:player_name1,name2:player_name2,id1:player_id1,id2:player_id2,m_id:response.data.insertId}});
    }catch(err){
      console.log(err);
    }
    window.location.reload();
  }

  function handleClickExit(){
     setOpen(false);
     navigate('/exit',{state:{name:'exitnow',p1_id:player_id1,p2_id:player_id2,player1:player_name1,player2:player_name2}});
  }

  return (
    <div className='dialog-box'>
      <ReactConfetti width={windowDimensions.width} height={windowDimensions.height} tweenDuration={1000}/>
      <Dialog
        open={open}
        onClose={()=>{setOpen(false)}}
      >
        <DialogTitle>
          <center className='dialog-title'>{"Congratulations "+ winner_name +"!!"}</center>
          </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <iframe src="https://giphy.com/embed/mbar54jwxlnKs5nlOc" width="300px" height="100px" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
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


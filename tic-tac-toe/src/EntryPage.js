import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './EntryPage.css';
import axios from 'axios';
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function EntryPage(){
    const [newPlayer,setNewPlayer]=useState({
    });
    let match_id;
    const [players,setPlayers]=useState([]);

    const navigate=useNavigate();

    useEffect(()=>{
        fetchData();
        displayPlayers();
    },[])

    const fetchData = async()=>{
    try{
        const result = await axios("http://localhost:5000/getmatches");
        // console.log(result.data);
    } catch(err){
        console.log('Oopsie Doopsie!! Something went wrong..');
    }
    
    };
    const [val1, setVal1]= useState({});
    const [val2, setVal2]= useState({});


    const handlePlayer = (e)=>{
        setNewPlayer({...newPlayer,
                [e.target.name]:e.target.value
        });
    }

    const handleClickPlayer=async(e)=>{
        e.preventDefault();
        try{
            const result = await axios.post("http://localhost:5000/addplayer",newPlayer);
            displayPlayers();
        } catch(err){
            console.log('Could not add player');
        }
    };
    
    const displayPlayers=async()=>{
        let result,player_names;
        try{
            result = await axios("http://localhost:5000/getplayers");
            console.log('ujwala',result.data);
            player_names=JSON.stringify(result.data);
        player_names=JSON.parse(player_names);
        setVal1(player_names[0]);
        setVal2(player_names[0]);
        setPlayers(player_names);
    }catch(err){
            console.log(err);
        }
    };

    function handleChangeOne(event){
        console.log(players[event.target.value]);
        setVal1(players[event.target.value]);
    };
    
    function handleChangeTwo(event){
        console.log(players[event.target.value]);
        setVal2(players[event.target.value]);
    };
    
    const PlayGame=async(e)=>{
        if(val1===val2){
            toast.warning("Please enter different names",{className:"alert",position:toast.POSITION.TOP_CENTER,autoClose:2000});
        }
else{
        e.preventDefault();
        try{
            let response = await axios.post("http://localhost:5000/updatematches",{'player1':val1.player_id,'player2':val2.player_id});
            match_id= response.data.insertId;
            console.log(match_id);
        }catch(err){
            console.log(err);
        }
        navigate('/game',{state:{name1:val1.player_name,name2:val2.player_name,id1:val1.player_id,id2:val2.player_id,m_id:match_id}});
    }
    }
    
    
    return(
        <>
            <div className="center-content">
                <h1 className="game-heading">TIC-TAC-TOE</h1>
                <div className="players">
                    <div id="player1">
                        <img id="player-image1" src="player.jpg" alt="Player1"/>
                        <select id="player-name1" onChange={handleChangeOne}>
                            {players.map((player,id) =>
                                <option key={player.player_id} value={id}>{player.player_name}</option>
                            )
                            }
                        </select>
                        {/* <input id="player-name1" val={val1} onChange={handleChangeOne} type="" placeholder="Player 1"/> */}
                    </div>
                    <div id="player2">
                    <img id="player-image2" src="player1.jpeg" alt="Player2"/>
                        <select id="player-name2" onChange={handleChangeTwo}>
                            {players.map((player,id) =>
                                <option key={player.player_id} value={id}>{player.player_name}</option>
                            )
                            }
                        </select>
                        {/* <input id="player-name2" val={val2} onChange={handleChangeTwo} type="text" placeholder="Player 2"/> */}
                    </div>
                </div>
            </div>
                <div className="newplayers" >
                <pre id="new_player_ask">New Player ?   </pre>
                <input id="new_player_name" name="player_name" type="text" onChange={(e)=>handlePlayer(e)} placeholder="Enter Name"/>
                <button type="submit" className="addmember-btn" onClick={(e)=>handleClickPlayer(e)}>Add Player</button>
                </div>
                <center><button type="submit" className="play-btn" onClick={PlayGame}>Play</button></center>
                <ToastContainer/>
        </>
    );

}

export default EntryPage;
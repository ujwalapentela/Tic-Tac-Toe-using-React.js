import axios from "axios";
import './Leaderboard.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Leaderboard(){
    const [playersinfo,setPlayersInfo]=useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
     player_info();
    },[]);

    function handleClick(){
     navigate('/')
    }

   const player_info=async()=>{
    let players;
       try{
           const info=await axios("http://localhost:5000/getplayersinfo");
           console.log(info.data);
           players=JSON.stringify(info.data);
           players=JSON.parse(players);
           setPlayersInfo(players);
       } catch(err){
            console.log("Unable to fetch players info"+err);
       }
   };


    return(
        <div className="leaderboard">
        <div className="board-header">
            <div className="board-content">
                <img src="trophy.png" id="trophy-image" alt="trophy"/>
                </div>
            <div className="board-content">
                <h1>LEADERBOARD</h1>
                </div>
            <div className="board-content">
                <img src="trophy.png" id="trophy-image" alt="trophy"/>
                </div>
        </div>
        <div className="players-status">
        <table>
        <thead>
            <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Matches</th>
            <th>Won</th>
            <th>Lost</th>
            <th>Draw</th>
            <th>Score</th>
            </tr>
        </thead>
        <tbody>
        { playersinfo.map((player,id)=>(
            <tr key={id}>
                <td>
                    {id+1===1 && <img id="gold_medal" src="gold_medal.png" alt="gold medal"/>}
                    {id+1===2 && <img id="silver_medal" src="silver_medal.png" alt="silver medal"/>}
                    {id+1===3 && <img id="bronze_medal" src="bronze_medal.png" alt="bronze medal"/>}
                    {id+1}
                </td>
                <td>{player.player_name}</td>
                <td>{player.matches_played}</td>
                <td>{player.matches_won}</td>
                <td>{player.matches_lost}</td>
                <td>{player.matches_draw}</td>
                <td>{player.score}</td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
        <div className="gotoentrybtn">
        <button id="back-btn1" onClick={handleClick}>BACK</button>
        </div>
        </div>
    );
}
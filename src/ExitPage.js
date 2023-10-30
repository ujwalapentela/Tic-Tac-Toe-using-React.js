import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ExitPage.css";
import PlayersCombined from "./playershistory/PlayersCombined";
import Player1 from "./playershistory/Player1";
import Player2 from "./playershistory/Player2";

export default function ExitPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [player1, setPlayer1] = useState([]);
  const [player2, setPlayer2] = useState([]);
  const [playerscombined, setPlayersCombined] = useState([]);
  let player_id1, player_id2, player_name1, player_name2;
  if (state === null) {
    player_name1 = "";
    player_name2 = "";
    player_id1 = 0;
    player_id2 = 0;
  } else {
    player_name1 = state.player1;
    player_name2 = state.player2;
    player_id1 = state.p1_id;
    player_id2 = state.p2_id;
  }

  useEffect(() => {
    if (state === null) GoBack();
    combined_info();
    player1_info();
    player2_info();
  }, []);

  function GoBack() {
    navigate("/");
  }

  function GoToLeaderboard() {
    navigate("/leaderboard");
  }

  const combined_info = async () => {
    let players;
    try {
      let info = await axios.post(
        "http://localhost:5000/getcombinedmatchinfo",
        { p_id1: player_id1, p_id2: player_id2 }
      );
      console.log(info.data);
      players = JSON.stringify(info.data);
      players = JSON.parse(players);
      setPlayersCombined(players);
      console.log(players);
    } catch (err) {
      console.log("Unable to fetch combined info " + err);
    }
  };

  const player1_info = async () => {
    let players;
    try {
      const info = await axios.post("http://localhost:5000/getplayer1info", {
        p_id1: player_id1,
      });
      console.log(info.data);
      players = JSON.stringify(info.data);
      players = JSON.parse(players);
      setPlayer1(players);
    } catch (err) {
      console.log("Unable to fetch player1 info" + err);
    }
  };
  const player2_info = async () => {
    let players;
    try {
      const info = await axios.post("http://localhost:5000/getplayer2info", {
        p_id2: player_id2,
      });
      console.log(info.data);
      players = JSON.stringify(info.data);
      players = JSON.parse(players);
      setPlayer2(players);
    } catch (err) {
      console.log("Unable to fetch player2 info" + err);
    }
  };

  return (
    <div className="exit-content">
      <div id="playerdetails1">
        {
          <Player1
            player_name1={player_name1}
            player_id1={player_id1}
            players={player1}
          />
        }
      </div>
      <div id="exit-gif">
        <pre>Hope you enjoyed! Do Visit Again!</pre>
        <iframe
          src="https://giphy.com/embed/dzMu8oCKwBbpUFMBNs"
          className="giphy-style"
        ></iframe>
      </div>
      <div className="exit-buttons">
        <div className="exit-btn">
          <button id="back-btn" onClick={GoBack}>
            BACK
          </button>
        </div>
        <div className="exit-btn">
          <button id="leaderboard-btn" onClick={GoToLeaderboard}>
            LEADERBOARD
          </button>
        </div>
      </div>
      <div id="players-combined">
        {<PlayersCombined players={playerscombined} />}
      </div>
      <div id="playerdetails2">
        {
          <Player2
            player_name2={player_name2}
            player_id2={player_id2}
            players={player2}
          />
        }
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import DialogWin from "./DialogWin";
import { useNavigate, useLocation } from "react-router-dom";
import DialogDraw from "./DialogDraw";
import axios from "axios";

function Square({ value, onSquareClick, id }) {
  return (
    <>
      <button className="square" id={id} onClick={onSquareClick}>
        {value}
      </button>
    </>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const navigate = useNavigate();
  const { state } = useLocation();
  let name1, name2, id1, id2, match_id;
  if (state === null) {
    name1 = "";
    name2 = "";
    id1 = 0;
    id2 = 0;
    match_id = 0;
  } else {
    name1 = state.name1;
    name2 = state.name2;
    id1 = state.id1;
    id2 = state.id2;
    match_id = state.m_id;
  }

  useEffect(() => {
    if (state === null) exit();
  }, []);

  const handleWin = async (winner_name) => {
    console.log("Entered handleWin");
    console.log(winner_name);
    let winner_id = winner_name === name1 ? id1 : id2;
    try {
      const result = await axios.post(
        "http://localhost:5000/updatematchesfinal",
        { m_id: match_id, status: "WIN", winner: winner_id }
      );
    } catch (err) {
      console.log("Error while updating matches" + err);
    }

    if (name1 === winner_name) {
      console.log("Entered try 1");
      try {
        const result1 = await axios.post(
          "http://localhost:5000/updateplayerswin",
          { id: id1 }
        );
        const result2 = await axios.post(
          "http://localhost:5000/updateplayerslose",
          { id: id2 }
        );
      } catch (err) {
        console.log("Error while updating players" + err);
      }
    } else if (name2 === winner_name) {
      try {
        console.log("Entered try 2");
        const result1 = await axios.post(
          "http://localhost:5000/updateplayerswin",
          { id: id2 }
        );
        const result2 = await axios.post(
          "http://localhost:5000/updateplayerslose",
          { id: id1 }
        );
        console.log(result1, result2);
      } catch (err) {
        console.log("Error while updating players " + err);
      }
    }
    winner = null;
    return true;
  };

  const handleDraw = async () => {
    console.log("Entered handleDraw");
    try {
      const result = await axios.post(
        "http://localhost:5000/updatematchesfinal",
        { m_id: match_id, status: "DRAW", winner: null }
      );
    } catch (err) {
      console.log("Error while updating matches" + err);
    }
    try {
      console.log("Entered try draw");
      const result = await axios.post(
        "http://localhost:5000/updateplayersdraw",
        { id1: id1, id2: id2 }
      );
      console.log(result);
    } catch (err) {
      console.log(err);
    }
    return true;
  };

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)[3]) {
      return;
    }

    const nextSquares = squares.slice();
    const id = "btn" + (1 + i);
    let val;
    if (xIsNext) {
      nextSquares[i] = "X";
      val = "x-color";
    } else {
      nextSquares[i] = "O";
      val = "o-color";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    {
      document.getElementById(id).classList.add(val);
    }
  }

  function ColorWin(a, b, c, winner) {
    if (winner) {
      const id1 = "btn" + (1 + a),
        id2 = "btn" + (1 + b),
        id3 = "btn" + (1 + c);
      const colorButton1 = id1 && document.getElementById(id1);
      const colorButton2 = id2 && document.getElementById(id2);
      const colorButton3 = id3 && document.getElementById(id3);

      if (winner === "X") {
        colorButton1.classList.add("x-win-color");
        colorButton2.classList.add("x-win-color");
        colorButton3.classList.add("x-win-color");
      } else {
        colorButton1.classList.add("o-win-color");
        colorButton2.classList.add("o-win-color");
        colorButton3.classList.add("o-win-color");
      }
    }
    return true;
  }
  function exit() {
    navigate("/");
  }

  let [a, b, c, winner] = calculateWinner(squares);
  const draw = isDraw(squares);
  let status, winner_name;
  if (winner) {
    status = "Winner: " + winner;
    winner_name = winner === "X" ? name1 : name2;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }
  return (
    <>
      <div className="status">
        {status}
        {winner && ColorWin(a, b, c, winner) && handleWin(winner_name) && (
          <DialogWin
            winner_name={winner_name}
            player_name1={name1}
            player_name2={name2}
            player_id1={id1}
            player_id2={id2}
          />
        )}
        {!winner && draw && handleDraw() && <DialogDraw />}
      </div>
      <br />
      <div className="grid-container">
        <div className="board-row">
          <Square
            value={squares[0]}
            id="btn1"
            onSquareClick={() => handleClick(0)}
          />
          <Square
            value={squares[1]}
            id="btn2"
            onSquareClick={() => handleClick(1)}
          />
          <Square
            value={squares[2]}
            id="btn3"
            onSquareClick={() => handleClick(2)}
          />
        </div>
        <div className="board-row">
          <Square
            value={squares[3]}
            id="btn4"
            onSquareClick={() => handleClick(3)}
          />
          <Square
            value={squares[4]}
            id="btn5"
            onSquareClick={() => handleClick(4)}
          />
          <Square
            value={squares[5]}
            id="btn6"
            onSquareClick={() => handleClick(5)}
          />
        </div>
        <div className="board-row">
          <Square
            value={squares[6]}
            id="btn7"
            onSquareClick={() => handleClick(6)}
          />
          <Square
            value={squares[7]}
            id="btn8"
            onSquareClick={() => handleClick(7)}
          />
          <Square
            value={squares[8]}
            id="btn9"
            onSquareClick={() => handleClick(8)}
          />
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c, squares[a]];
    }
  }
  return [null, null, null, null];
}

function isDraw(squares) {
  let total = 0;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] != null) {
      total += 1;
    }
  }
  if (total == 9) return true;
  return false;
}

import { useState } from "react";
import { FaTimes, FaRegCircle } from "react-icons/fa";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value === "X" ? <FaTimes /> : value === "O" ? <FaRegCircle /> : ""}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [winner, setWinner] = useState(null);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);

    const gameWinner = calculateWinner(nextSquares);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  }

  function resetGame() {
    window.location.reload(); // Simple refresh to restart the game
  }

  return (
    <>
      <div className="status">
        {winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`}
      </div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>

      {/* Winner Modal */}
      {winner && (
        <div className="modal">
          <div className="modal-content">
            <h2>🎉 Winner: {winner}!</h2>
            <button onClick={resetGame}>Restart Game</button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // History of moves
  const [currentMove, setCurrentMove] = useState(0); // Current move index
  const xIsNext = currentMove % 2 === 0; // Check if it's X's turn
  const currentSquares = history[currentMove]; // Current game state

  // Handle the next move
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); // Move to the next state
  }

  // Undo the last move
  function undoMove() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1); // Move back in history
    }
  }

  // Jump to a specific move
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Mapping history moves for navigation
  const moves = history.map((squares, move) => {
    let description = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button
          className="undo-button"
          onClick={undoMove}
          disabled={currentMove === 0}
        >
          Undo Move
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
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
      return squares[a];
    }
  }
  return null;
}

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
      return (
          <button className="square" onClick={props.onClick}>
              {props.value}
          </button>
      );
  }
  
  function  renderSquare(val, props) {
    const { squares, onClick } = props;
    return (
      <Square
        value={squares[val]}
        onClick={() => {onClick(val)}}
      />
    );
  }

  function Board(props) {
    return (
      <React.Fragment>
        <div className="board-row">
          {renderSquare(0, props)}
          {renderSquare(1, props)}
          {renderSquare(2, props)}
        </div>
        <div className="board-row">
          {renderSquare(3, props)}
          {renderSquare(4, props)}
          {renderSquare(5, props)}
        </div>
        <div className="board-row">
          {renderSquare(6, props)}
          {renderSquare(7, props)}
          {renderSquare(8, props)}
        </div>
      </React.Fragment>
    );
  }
  
  function handleClick(val, state) {
    const {
      stepNumber,
      setStepNumber,
      xIsNext,
      setXIsNext,
      setHistory,
    } = state;

    let { history } = state;
    
    history = history.slice(0, stepNumber + 1);          
    const current = history[history.length - 1];
    const squares = current.squares.slice();        

    if(calculateWinner(squares) || squares[val]) {
        return;
    }

    squares[val] = xIsNext ? 'X' : 'O';
    setXIsNext(!xIsNext);
    setStepNumber(history.length);
    setHistory(history.concat([{ squares }]));
  }

  function jumpTo(step, state) 
  {
    const {
      setStepNumber,
      setXIsNext,
    } = state;

    setStepNumber(step);
    setXIsNext((step % 2 ) == 0);
  }

  function getMoves(state) {
    const {
      stepNumber,
      history,
    } = state;

    const moves = history.map((step, move) => {
      const desc = move ?
      `Go to move ${move}` :
      'Go to game start';
      if (stepNumber === move) {
          return (
          <li key={move}>
              <button onClick={() => jumpTo(move, state)}>
                  <b>
                      {desc}
                  </b>
              </button>
          </li>                    
          )
      }
      return (
          <li key={move}>
              <button onClick={() => jumpTo(move, state)}>{desc}</button>
          </li>
      );
    });

    return moves;
  }

  function Game(props) {
    const [ stepNumber, setStepNumber ] = useState(0);
    const [ xIsNext, setXIsNext ] = useState(true);
    const [ history, setHistory ] = useState([{ squares: Array(9).fill(null),}]);

    const state = {
      stepNumber,
      setStepNumber,
      xIsNext,
      setXIsNext,
      history,
      setHistory,
    }

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    let className;
    if(winner) {
        status = `Winner: ${winner}`;
        className = 'green';
    } else {
        if ((current.squares.filter((x) => { return x === null})).length > 0) {
            status = `Next player: ${(xIsNext ? 'X' : 'O')}`
        } else {
            status = 'GAME OVER';
            className = 'red';
        }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
              squares={current.squares}
              onClick={(i) => handleClick(i, state)}
          />
        </div>
        <div className="game-info">
          <div className={className}>{status}</div> 
          <ol>{getMoves(state)}</ol>
        </div>
      </div>
    );
  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
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

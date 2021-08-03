import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            style={props.isHighlighted ? { background: 'yellow'} : {}}
            className="square" 
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, isHighlighted) {
        return (
            <Square
             key={i} 
             value={this.props.squares[i]}
             isHighlighted={isHighlighted} 
             onClick={() => this.props.onClick(i)}/>
        );
    }

    render() {
        let counter = 0;
        let boardRows = [];
        let isGameOver;
        if(this.props.winningSquares) {
            isGameOver = this.props.winningSquares.length;
        }
        for(let i = 0; i < 3; i++) {
            let rowSquares = [];
            for(let j = 0; j < 3; j++) {
                let isHighlighted = isGameOver && this.props.winningSquares.includes(counter);
                rowSquares.push(
                    this.renderSquare(counter, isHighlighted)
                );
                counter += 1;
            }
            boardRows.push(<div key={i} className="board-row">{rowSquares}</div>);
        }
        return <div>{boardRows}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            winningSquares: [],
            areMovesAsc: true,
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({ 
            history: history.concat([{
                squares: squares,
                coordinates: convert1DArrayIndexTo2DArrayCoordinates(i),
            }]),
            winningSquares: this.calculateWinnerSquares(squares),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    calculateWinner(squares) {
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

    calculateWinnerSquares(squares) {
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
            return lines[i].slice();
          }
        }
        return [];
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    sortMoves() {
        this.setState({
            areMovesAsc: !this.state.areMovesAsc,
        });
    }

    render() {        
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);
        const status = winner ? `Winner ${winner}` : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        const moves = history.map((_, move) => {
            const desc = move ? `Go to move #${move}` : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    {history[move].coordinates &&
                        <span>({history[move].coordinates.col},{history[move].coordinates.row})</span>
                    }
                </li>
            );
        }).sort((a, b) => this.state.areMovesAsc ? a.key > b.key : b.key > a.key);
        return (
            <div className="game">
            <div className="game-board">
                <Board 
                 squares={current.squares}
                 winningSquares={this.state.winningSquares}
                 onClick={(i) => this.handleClick(i)}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            <div>
                <button onClick={() => this.sortMoves()}>{this.state.areMovesAsc ? 'Desc' : 'Asc'}</button>
            </div>
            </div>
        );
    }
}

function convert1DArrayIndexTo2DArrayCoordinates(i) {
    const remainder = i % 3;
    return {
        col: remainder,
        row: i < 3 ? 0 : i < 6 ? 1 : 2
    };
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


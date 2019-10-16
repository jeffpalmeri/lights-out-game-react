import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';

class Board extends Component {
  static defaultProps = {
    nRows: 5,
    nCols: 5,
    chanceLightStartsOn: 0.25
  };

  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard()
    }
  }

  createBoard() {
    // create array-of-arrays of true/false values
    let board = [];

    for(let x = 0; x < this.props.nRows; x++) {
      let row = [];
      for(let y = 0; y < this.props.nCols; y++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }
    
    return board
  }

  // handle changing a cell: update board & determine if winner
  flipCellsAround(coord) {
    // console.log('flipping!', coord);
    let {nCols, nRows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < nCols && y >= 0 && y < nRows) {
        board[x][y] = !board[x][y];
      }
    }

    // flip initial cell
    flipCell(x, y);
    flipCell(x+1, y);
    flipCell(x-1, y);
    flipCell(x, y+1);
    flipCell(x, y-1);

    // win when every cell is turned off
    let hasWon = board.every(row => row.every(cell => !cell));

    this.setState({board, hasWon});
  }


  // Render game board or winning message

  render() {
    // if the game is won, just show a winning msg & render nothing else
    if(this.state.hasWon) {
      return <h1>You won the game!</h1>
    };
    let tableBoard = [];
    for(let x = 0; x < this.props.nRows; x++) {
      let row = [];
      for(let y = 0; y < this.props.nCols; y++) {
        let coord = `${x}-${y}`;
        row.push(<Cell isLit={this.state.board[x][y]} key={coord}
          flipCellsAroundMe={() => this.flipCellsAround(coord)}
        />);
      }
      tableBoard.push(<tr key={x}>{row}</tr>);
    }

    return(
      <div>
        <div className="Board-title">
          <div className="neon-orange">Lights</div>
          <div className="neon-blue">Out</div>
        </div>
        <table className="Board">
        <tbody>
          {tableBoard}
        </tbody>
      </table>
      </div>
    )
  }
}

export default Board;
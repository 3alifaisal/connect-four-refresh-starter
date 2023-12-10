const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']]

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
    Screen.setGridlines(true);

    // Replace this with real commands
    Screen.addCommand('d', 'Press d to go Rsight', 
    () => { this.cursorMove(this.cursor.right); });

    Screen.addCommand('a', 'Press a to go Left',
    () => { this.cursorMove(this.cursor.left); });

    Screen.addCommand('j', 'Press j to place move',
     () => { this.placeMove(); });
    
    Screen.render();
  }

  cursorMove(cursorMoveFunction) {
    cursorMoveFunction.call(this.cursor);
    Screen.render();
  }
  placeMove() {
    const cursorCol = this.cursor.col;

    // Find the first available row from the bottom of the column
    let row;
    for (row = this.grid.length - 1; row >= 0; row--) {
      if (this.grid[row][cursorCol] === ' ') {
        this.grid[row][cursorCol] = this.playerTurn;
        // Use Screen.setGrid to update the screen with the new move
        Screen.setGrid(row, cursorCol, this.playerTurn);
        break;
      }
    }

    // If the column is full, do nothing
    if (row === -1) {
      return;
    }

    // Alternate player turns between 'X' and 'O'
    this.playerTurn = this.playerTurn === 'X' ? 'O' : 'X';

    // Check for a win or tie
    const result = ConnectFour.checkWin(this.grid);
    if (result) {
      ConnectFour.endGame(result);
    }

    // Render the updated grid
    Screen.render();
  }



  static checkWin(grid) {
    // check for horizantal wins
    for (let row = 0; row < grid.length; row++) {
        for(let col = 0; col < grid[row].length; col++)
      if (grid[row][col] !== ' ' && 
          grid[row][col  ] === grid[row][col+1] && 
          grid[row][col+1] === grid[row][col+2] && 
          grid[row][col+2] === grid[row][col+3]) {
        // If a player has 4 consecutive Xs or Os, return the player symbol (X or O)
        return grid[row][col];
      }
    }
    // check for vertical wins
    let columnLength = grid[0].length;
    for (let col = 0; col < columnLength; col++) {
        for(let row = 0; row < grid.length -3; row++){
          if (grid[row][col] !== ' ' && 
              grid[row  ][col] === grid[row+1][col] && 
              grid[row+1][col] === grid[row+2][col] && 
              grid[row+2][col] === grid[row+3][col]) {
            // If a player has 4 consecutive Xs or Os for entire column, return the player symbol (X or O)
            return grid[row][col];
          }
        }
     
    }
    // check for diagonal downwards wins
    for (let col = 0; col < columnLength; col++) {
      for (let row = 0; row < grid.length -3; row++) {
    if (grid[row][col] !== ' ' && 
        grid[row   ][col  ] === grid[row+1][col+1] && 
        grid[row +1][col+1] === grid[row+2][col+2] && 
        grid[row +2][col+2] === grid[row+3][col+3]) {
      return grid[row][col];
    }
     
      }
  }

    // Check for diagonal upward wins
    for (let col = 0; col < columnLength; col++) {
      for (let row = grid.length -1 ; row >= 3; row--) {
    if (grid[row][col] !== ' ' && 
        grid[row  ][col  ] === grid[row-1][col+1] && 
        grid[row-1][col+1] === grid[row-2][col+2] && 
        grid[row-2][col+2] === grid[row-3][col+3]) {
      return grid[row][col];
    }
  }
}
    // Check for a tie (if there are no empty spaces left)
    const isTie = grid.every(row => row.every(cell => cell !== ' '));
    if (isTie) {
      return 'T'; // Return 'T' for tie
    }

    // If no winner and the game is not a tie, return false to indicate the game hasn't ended yet

    return false;

    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended

  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = ConnectFour;

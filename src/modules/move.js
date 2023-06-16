const { Game, Cell } = require('./../models');

//comprobar turno
async function checkTurn(gameId, player) {
    const game = await Game.findByPk(gameId);
    if (game.turn === player && game.winner === null) {
      return true;
    }
    return false;
}

//colocar ficha en la columna
async function putTokenInColumn(n_column, gameId, player) {
    const cells = await Cell.findAll({
      where: {
        gameId: gameId,
        column: n_column
      }
    });
    const column = [];
    for (const cell of cells) {
      const { row, status } = cell;
      column[row] = status;
    }

    for (let i = 0; i < 7; i++) {
      if (column[i] === 0) {
        const cell = cells.find(cell => cell.row === i);
        await cell.update({status: player});
        return cell;
      }
    }
    return false;
}

//verificar si hay un ganador
async function checkWinner(gameId) {
    const board = await Cell.findAll({where:{gameId:gameId}});
    const matrix = [];
    for (const cell of board) {
        const { row, column, status } = cell;
        if (!matrix[row]) {
            matrix[row] = [];
        }
        matrix[row][column] = status;
    }
    imprimir_matriz(matrix)
    for (let i=0; i<7; i++){
        for (let j=0; j<6; j++){
            if (matrix[i][j] === matrix[i][j+1] && matrix[i][j] === matrix[i][j+2] && matrix[i][j] === matrix[i][j+3] && matrix[i][j] !== 0){
                return matrix[i][j];
            }
        }
    }
    for (let i=0; i<4; i++){
        for (let j=0; j<9; j++){
            if (matrix[i][j] === matrix[i+1][j] && matrix[i][j] === matrix[i+2][j] && matrix[i][j] === matrix[i+3][j] && matrix[i][j] !== 0){
                return matrix[i][j];
            }
        }
    }
    for (let i=0; i<4; i++){
        for (let j=0; j<6; j++){
            if (matrix[i][j] === matrix[i+1][j+1] && matrix[i][j] === matrix[i+2][j+2] && matrix[i][j] === matrix[i+3][j+3] && matrix[i][j] !== 0){
                return matrix[i][j];
            }
        }
    }
    for (let i=0; i<4; i++){
        for (let j=3; j<9; j++){
            if (matrix[i][j] === matrix[i+1][j-1] && matrix[i][j] === matrix[i+2][j-2] && matrix[i][j] === matrix[i+3][j-3] && matrix[i][j] !== 0){
                return matrix[i][j];
            }
        }
    }
    return 0;
}

//cambiar el turno
async function changeTurn(gameId) {
    const game = await Game.findByPk(gameId);
    if (game.winner !== null){
        await game.update({turn: 0});
    } else if (game.turn === 1){
        await game.update({turn: 2});
    } else if (game.turn === 2){
        await game.update({turn: 1});
    }
    return;
}

//game is finished
async function finishGame(gameId, winner) {
    const game = await Game.findByPk(gameId);
    await game.update({winner: winner});
    return game;
}

function imprimir_matriz(matrix){
    for (let i = 6; i >= 0; i--){
        console.log(matrix[i][0], matrix[i][1], matrix[i][2], matrix[i][3],
            matrix[i][4], matrix[i][5], matrix[i][6], matrix[i][7], matrix[i][8]);
    }
}

module.exports = {
    checkTurn: checkTurn,
    putTokenInColumn: putTokenInColumn,
    checkWinner: checkWinner,
    changeTurn: changeTurn,
    finishGame: finishGame
}

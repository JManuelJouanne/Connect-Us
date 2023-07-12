const { Game, Cell, User, Player } = require('./../models');

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
    const board = await Cell.findAll({
      where: {
        gameId: gameId,
        column: n_column
      }
    });
    const column = [];
    for (const cell of board) {
      const { row, status } = cell;
      column[row] = status;
    }

    for (let i = 6; i >= 0; i--) {
      if (column[i] === 0) {
        const cell = board.find(cell => cell.row === i);
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

async function getBoard(gameId) {
    const board = await Cell.findAll({
        where: { gameId: gameId },
        order: [['row', 'ASC'], ['column', 'ASC']]
      });
    return board;
}

//cambiar el turno
async function changeTurn(gameId) {
    const game = await Game.findByPk(gameId);
    if (game.turn === 1){
        await game.update({turn: 2});
    } else if (game.turn === 2){
        await game.update({turn: 1});
    }
    const player = await Player.findAll({where:{gameId:gameId, number:game.turn}});
    const user = await User.findByPk(player[0].userId);
    return user;
}

//game is finished
async function finishGame(gameId, winner) {
    const game = await Game.findByPk(gameId);
    await game.update({winner: winner});
    await game.update({turn: 0});
    const player = await Player.findAll({where:{gameId:gameId, number:winner}});
    const user = await User.findByPk(player[0].userId);
    return user;
}

function imprimir_matriz(matrix){
    for (let i = 6; i >= 0; i--){
        console.log(matrix[i][0], matrix[i][1], matrix[i][2], matrix[i][3],
            matrix[i][4], matrix[i][5], matrix[i][6], matrix[i][7], matrix[i][8]);
    }
}

//jugada, poner ficha en una columna
async function play(data) {
    const gameId = data.gameId;
    const n_column = data.column;
    const player = data.player;
    let result = {};

    const turn = await checkTurn(gameId, player);
    if (turn === false){
        result = {message: "No es tu turno"};
    } else {
        const put_token = await putTokenInColumn(n_column, gameId, player);
        if (put_token === false){
            result = {message: "Esa columna está llena"};
        } else {
            const winner = await checkWinner(gameId);
            const board = await getBoard(gameId)
            if (winner === 0) {
                const user = await changeTurn(gameId);
                result = {cell: put_token, board: board, message: `Es el turno de ${user.username}`};
            } else {
                const user = await finishGame(gameId, winner);
                result = {cell: put_token, board: board, message: `Ganó ${user.username}!!!`};
            }
        }
    }
    return result;
}

module.exports = play

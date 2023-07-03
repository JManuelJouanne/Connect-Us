const Router = require('koa-router');
const move = require('./../modules/move');
const authUtils = require('../modules/auth');

const router = new Router();

//lista de las celdas de un tablero específico
router.get('cells.show', '/:gameId', authUtils.checkUser, async (ctx) => {
    try {
        const board = await ctx.orm.Cell.findAll({where:{gameId:ctx.params.gameId}});
        ctx.body = board;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//jugada, poner ficha en una columna
router.patch('cell.update', '/:gameId/:column', authUtils.checkUser, async (ctx) => {
    try {
        const gameId = ctx.params.gameId;
        const n_column = ctx.params.column;
        const player = ctx.request.body.player;

        const turn = await move.checkTurn(gameId, player);
        if (turn === false){
            ctx.body = {message: "No es tu turno"};
            ctx.status = 400;
        } else {
            const put_token = await move.putTokenInColumn(n_column, gameId, player);
            if (put_token === false){
                ctx.body = {message: "Esa columna está llena"};
                ctx.status = 400;
            } else {
                ctx.status = 200;
                const winner = await move.checkWinner(gameId);
                if (winner === 0) {
                    const user = await move.changeTurn(gameId);
                    ctx.body = {cell: put_token.dataValues, message: `Es el turno de ${user.username}`};
                    console.log(ctx.body);
                } else {
                    const user = await move.finishGame(gameId, winner);
                    ctx.body = {cell: put_token.dataValues, message: `Ganó ${user.username}!!!`};
                }
            }
        }
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
});


module.exports = router;

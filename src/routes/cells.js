const Router = require('koa-router');
const move = require('./../modules/move');

const router = new Router();

//lista de las celdas de un tablero específico
router.get('cells.show', '/:gameId', async (ctx) => {
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
router.patch('cell.update', '/:gameId/:column', async (ctx) => {
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
                ctx.body = {message: "Columna llena"};
                ctx.status = 400;
            } else {
                ctx.status = 200;
                const winner = await move.checkWinner(gameId);
                if (winner === 0) {
                    await move.changeTurn(gameId);
                    ctx.body = {cell: put_token.dataValues, message: "No Ganador"};
                    console.log(ctx.body);
                } else {
                    await move.finishGame(gameId, winner);
                    ctx.body = {cell: put_token.dataValues, message: "Ganador"};
                }
            }
        }
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
});


module.exports = router;

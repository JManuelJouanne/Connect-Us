const Router = require('koa-router');

const router = new Router();

//lista de todos los games
router.get('games.list', '/', async (ctx) => {
    try {
        const games = await ctx.orm.Game.findAll();
        ctx.body = games;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//un game específico
router.get('game.show', '/:id', async (ctx) => {
    try {
        const game = await ctx.orm.Game.findByPk(ctx.params.id);
        ctx.body = game;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//crear un nuevo game
router.post('game.create', '/', async (ctx) => {
    try {
        const game = await ctx.orm.Game.create({turn:1, winner:null});
        console.log(game.dataValues);
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 7; j++){
                await ctx.orm.Cell.create({gameId:game.id, column:i, row:j, status:0});
            }
        }
        const n_player = Math.floor(Math.random() * 2) + 1;
        const player = await ctx.orm.Player.create({userId:ctx.request.body.userId, gameId:game.id, number:n_player});
        console.log(player.dataValues);

        ctx.body = game;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.delete('game.delete', '/:id', async (ctx) => {
    try {
        const game = await ctx.orm.Game.findByPk(ctx.params.id);
        const players = await ctx.orm.Player.findAll({where:{gameId:ctx.params.id}});
        for (let i = 0; i < players.length; i++){
            await players[i].destroy();
        }
        const cells = await ctx.orm.Cell.findAll({where:{gameId:ctx.params.id}});
        for (let i = 0; i < cells.length; i++){
            await cells[i].destroy();
        }
        await game.destroy();
        ctx.body = {message: "Partida Eliminada"};
        ctx.status = 200;
    } catch (error){        
        ctx.body = error;
        ctx.status = 400;
    }
});


module.exports = router;

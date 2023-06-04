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
        const game = await ctx.orm.Game.create(ctx.request.body);
        ctx.body = game;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//cambuiar el turno
router.patch('game.turn', '/:id', async (ctx) => {
    try {
        const game = await ctx.orm.Game.findByPk(ctx.params.id);
        if (game.turn == 1){
            game.turn = 2;
            await game.save();
            ctx.body = game;
            ctx.status = 200;
        }
        else if (game.turn == 2){
            game.turn = 1;
            await game.save();
            ctx.body = game;
            ctx.status = 200;
        }
    } catch (error){
        ctx.body = error
        ctx.status = 400
    }
});

//game is finished
router.put('game.finish', '/:id', async (ctx) => {
    try {
        const game = await ctx.orm.Game.findByPk(ctx.params.id);
        game.winner = ctx.request.body.winner;
        await game.save();
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
        ctx.body = {message: "Game deleted"};
        ctx.status = 200;
    } catch (error){        
        ctx.body = error;
        ctx.status = 400;
    }
});


module.exports = router;

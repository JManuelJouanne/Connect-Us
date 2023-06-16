const Router = require('koa-router');

const router = new Router();

//lista de todos los players
router.get('players.list', '/', async (ctx) => {
    try {
        const players = await ctx.orm.Player.findAll();
        ctx.body = players;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//mostrar un player
router.get('player.show', '/:id', async (ctx) => {
    try{
        const player = await ctx.orm.Player.findByPk(ctx.params.id);
        ctx.body = player;
        ctx.status = 200;
    }
    catch(error){
        ctx.body = error;
        ctx.status = 400;
    }

});

//lista de los players de un usuario
router.get('player.list', '/user/:userId', async (ctx) => {
    try {
        const players = await ctx.orm.Player.findAll({where:{userId:ctx.params.userId}});
        ctx.body = players;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//lista de los players de un game
router.get('players.show', '/game/:gameId', async (ctx) => {
    try {
        const players = await ctx.orm.Player.findAll({where:{gameId:ctx.params.gameId}});
        ctx.body = players;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//unirse a partida existene
router.post('player.join', '/:gameId', async (ctx) => {
    try {
        const players = await ctx.orm.Player.findAll({where:{gameId:ctx.params.gameId}});
        if (players.length === 1){
            const n_player = (players[0].number % 2) + 1;
            const player = await ctx.orm.Player.create({userId:ctx.request.body.userId, gameId:ctx.params.gameId, number:n_player});
            ctx.body = player;
            ctx.status = 200;
        } else {
            ctx.body = {message: "La partida está llena"};
            ctx.status = 400;
        }
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.delete('player.delete', '/:id', async (ctx) => {
    try {
        const player = await ctx.orm.Player.findByPk(ctx.params.id);
        await player.destroy();
        ctx.body = {message: 'Player Eliminado'};
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});


module.exports = router;

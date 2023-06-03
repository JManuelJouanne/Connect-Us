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

//lista de un player
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

//lista de los players de un game y un usuario
router.get('player.show', '/:userId/:gameId', async (ctx) => {
    try {
        const player = await ctx.orm.Player.findOne({where:{userId:ctx.params.userId, gameId:ctx.params.gameId}});
        ctx.body = player;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.post('player.create', '/', async (ctx) => {
    try {
        const player = await ctx.orm.Player.create(ctx.request.body);
        ctx.body = player;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.delete('player.delete', '/:id', async (ctx) => {
    try {
        const player = await ctx.orm.Player.findByPk(ctx.params.id);
        await player.destroy();
        ctx.body = player;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});


module.exports = router;

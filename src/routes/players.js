const Router = require('koa-router');
const games = require('./../modules/games');
const authUtils = require('../modules/auth');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

const router = new Router();

//lista de todos los players
router.get('players.list', '/', authUtils.checkAdmin, async (ctx) => {
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
router.get('player.show', '/:id', authUtils.checkUser, async (ctx) => {
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
router.get('player.list', '/user/:userId', authUtils.checkUser, async (ctx) => {
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
router.get('players.show', '/game/:gameId', authUtils.checkUser, async (ctx) => {
    try {
        const players = await ctx.orm.Player.findAll({where:{gameId:ctx.params.gameId}});
        ctx.body = players;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//nombre del usuario que comienza
router.get('players.show', '/start/:gameId', authUtils.checkUser, async (ctx) => {
    try {
        const game = await ctx.orm.Game.findByPk(ctx.params.gameId);
        const players = await ctx.orm.Player.findAll({where:{
            gameId:ctx.params.gameId,
            number:game.turn
        }});
        console.log(players);
        const user = await ctx.orm.User.findByPk(players[0].userId);
        ctx.body = {
            message: `Es el turno de ${user.username}`,
            turn: game.turn
        };
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//unirse a partida con amigo
router.post('friend_player.join', '/:gameId', authUtils.checkUser, async (ctx) => {
    try {
        const secret = process.env.JWT_SECRET;
        const token = ctx.request.header.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        const userId = parseInt(decoded.sub, 10);

        const game = await ctx.orm.Game.findByPk(ctx.params.gameId);
        if (game.friend === 1){
            await game.update({friend:2});
            const player = await games.create_player(userId, ctx.params.gameId);
            ctx.body = {player: player, game: game};
            ctx.status = 200;
        } else {
            ctx.body = {message: "Ya hay dos jugadores en la partida"};
            ctx.status = 400;
        }
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//unirse a partida random
router.post('player.join', '/', authUtils.checkUser, async (ctx) => {
    try {
        const secret = process.env.JWT_SECRET;
        const token = ctx.request.header.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        const userId = parseInt(decoded.sub, 10);

        const partidas = await ctx.orm.Game.findAll({where:{friend:0}});
        for (let i = 0; i < partidas.length; i++){
            const plyr = await ctx.orm.Player.findAll({where:{gameId:partidas[i].id}});
            if (plyr[0].userId !== userId){
                await partidas[0].update({friend:2});
                const player = await games.create_player(userId, partidas[0].id);
                ctx.body = {player: player, game: partidas[i]};
                ctx.status = 200;
                return;
            }
        }
        const { game, player } = await games.create_game(userId, 0);
        ctx.body = {player: player, game: game};
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.delete('player.delete', '/:id', authUtils.checkUser, async (ctx) => {
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

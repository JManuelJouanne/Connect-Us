const Router = require('koa-router');
const games = require('./../modules/games');
const authUtils = require('../modules/auth');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Op } = require('sequelize');


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
        const players = await ctx.orm.Player.findAll({where:{
            gameId:ctx.params.gameId,
            number:1
        }});
        const user = await ctx.orm.User.findByPk(players[0].userId);
        ctx.body = {message: `Comienza ${user.username}}`};
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
        let ready = false;

        const juegos = await ctx.orm.Game.findAll({where:{friend:0}});

        if (juegos.length > 0){
            for (let i = 0; i < juegos.length; i++) {
                const partidas = await ctx.orm.Player.findAll({ 
                    where: { 
                        gameId: juegos[i].id, 
                        userId: { [Op.not]: userId },
                    } 
                    });
                if (partidas.length > 0 && ready === false){
                    await juegos[i].update({friend:2});
                    ctx.body = {player: partidas[0], game: juegos[i]};
                    ctx.status = 200;
                    ready = true;
                }
            }
            if (ready === false) {
            const { game, player } = await games.create_game(userId, 0);
            ctx.body = {player: player, game: game};
            ctx.status = 200;
            }
        } else {
            const { game, player } = await games.create_game(userId, 0);
            ctx.body = {player: player, game: game};
            ctx.status = 200;
        }
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

const Router = require('koa-router');

const router = new Router();

//lista de todos los players
router.get('players.list', '/', async (ctx) => {
    try {
    } catch (error){
    }
});

//lista de los players de un usuario
router.get('player.list', '/:userId', async (ctx) => {
    try {
    } catch (error){
    }
});

//lista de los players de un game
router.get('players.show', '/:gameId', async (ctx) => {
    try {
    } catch (error){
    }
});

router.get('player.show', '/:userId/:gameId', async (ctx) => {
    try {
    } catch (error){
    }
});

router.post('player.create', '/', async (ctx) => {
    try {
    } catch (error){
    }
});

router.delete('player.delete', '/:id', async (ctx) => {
    try {
    } catch (error){
    }
});


module.exports = router;

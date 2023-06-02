const Router = require('koa-router');

const router = new Router();

//lista de todos los games
router.get('games.list', '/', async (ctx) => {
    try {
    } catch (error){
    }
});

//un game específico
router.get('game.show', '/:id', async (ctx) => {
    try {
    } catch (error){
    }
});

router.post('game.create', '/', async (ctx) => {
    try {
    } catch (error){
    }
});

router.patch('game.turn', '/:id', async (ctx) => {
    try {
    } catch (error){
    }
});

router.put('game.finish', '/:id', async (ctx) => {
    try {
    } catch (error){
    }
});

router.delete('game.delete', '/:id', async (ctx) => {
    try {
    } catch (error){
    }
});


module.exports = router;

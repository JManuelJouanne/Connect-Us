const Router = require('koa-router');

const router = new Router();

//lista de todas las celdas (no se si es necesario)
router.get('cells.list', '/', async (ctx) => {
    try {
    } catch (error){
    }
});

//lista de las celdas de un tablero específico
router.get('cells.show', '/:gameId', async (ctx) => {
    try {
    } catch (error){
    }
});

//uns celda específica de un tablero
router.get('cell.show', '/:id', async (ctx) => {
    try {
    } catch (error){
    }
});

router.post('cell.create', '/', async (ctx) => {
    try {
    } catch (error){
    }
});

router.patch('cell.update', '/:id', async (ctx) => {
    try {
    } catch (error){
    }
});

router.delete('cell.delete', '/:id', async (ctx) => {
    try {
    } catch (error){
    }
});


module.exports = router;

const Router = require('koa-router');

const router = new Router();

//lista de todas las celdas (no se si es necesario)
//router.get('cells.list', '/', async (ctx) => {
//    try {
//    } catch (error){
//    }
//});

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

//uns celda específica de un tablero (NO SE USA)
//router.get('cell.show', '/:id', async (ctx) => {
//    try {
//        const cell = await ctx.orm.Cell.findByPk(ctx.params.id);
//        ctx.body = cell;
//        ctx.status = 200;
//    } catch (error){
//        ctx.body = error;
//        ctx.status = 400;
//    }
//});

//crear una celda (se van a crear con iteraciones desde el frontend)
router.post('cell.create', '/', async (ctx) => {
    try {
        const cell = await ctx.orm.Cell.create(ctx.request.body);
        ctx.body = cell;
        ctx.status = 201;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.patch('cell.update', '/:gameId/:column', async (ctx) => {
    try {
      const cells = await ctx.orm.Cell.findAll({
        where: {
          gameId: ctx.params.gameId,
          column: ctx.params.column
        }
      });
  
      const column = [];
      for (const cell of cells) {
        const { row, status } = cell;
        column[row] = status;
      }
  
      for (let i = 1; i < 8; i++) {
        if (column[i] === 0) {
          const cell = cells.find(cell => cell.row === i);
          await cell.update(ctx.request.body);
          ctx.body = cell;
          ctx.status = 201;
          return;
        }
      }
  
      ctx.body = { message: 'columna llena' };
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
});

router.get('cells.checkwinner', '/winner/:gameId', async (ctx) => {
    try {
        const board = await ctx.orm.Cell.findAll({where:{gameId:ctx.params.gameId}});
        const matrix = [];
        for (const cell of board) {
            const { row, column, status } = cell;
            if (!matrix[row]) {
                matrix[row] = [];
            }
            matrix[row][column] = status;
        }
        console.log(matrix);
        for (let i=1; i<8; i++){
            for (let j=1; j<7; j++){
                if (matrix[i][j] === matrix[i][j+1] && matrix[i][j] === matrix[i][j+2] && matrix[i][j] === matrix[i][j+3] && matrix[i][j] !== 0){
                    ctx.body = {message: 'winner', winner: matrix[i][j]};
                    ctx.status = 200;
                    return;
                }
            }
        }
        for (let i=1; i<5; i++){
            for (let j=1; j<10; j++){
                if (matrix[i][j] === matrix[i+1][j] && matrix[i][j] === matrix[i+2][j] && matrix[i][j] === matrix[i+3][j] && matrix[i][j] !== 0){
                    ctx.body = {message: 'winner', winner: matrix[i][j]};
                    ctx.status = 200;
                    return;
                }
            }
        }
        for (let i=1; i<5; i++){
            for (let j=1; j<7; j++){
                if (matrix[i][j] === matrix[i+1][j+1] && matrix[i][j] === matrix[i+2][j+2] && matrix[i][j] === matrix[i+3][j+3] && matrix[i][j] !== 0){
                    ctx.body = {message: 'winner', winner: matrix[i][j]};
                    ctx.status = 200;
                    return;
                }
            }
        }
        for (let i=1; i<5; i++){
            for (let j=4; j<10; j++){
                if (matrix[i][j] === matrix[i+1][j-1] && matrix[i][j] === matrix[i+2][j-2] && matrix[i][j] === matrix[i+3][j-3] && matrix[i][j] !== 0){
                    ctx.body = {message: 'winner', winner: matrix[i][j]};
                    ctx.status = 200;
                    return;
                }
            }
        }
        ctx.body = {message: 'no winner'};
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

//eliminar una celda. Se podría usar también de forma iterada desde el front cuando se elimine una partida
router.delete('cell.delete', '/:id', async (ctx) => {
    try {
        const cell = await ctx.orm.Cell.findByPk(ctx.params.id);
        await cell.destroy();
        ctx.body = {message: 'cell deleted'};
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});


module.exports = router;

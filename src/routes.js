const Router = require('koa-router');
const board = require('./routes/board');

const router = new Router();

router.use("/board", board.routes());


module.exports = router;
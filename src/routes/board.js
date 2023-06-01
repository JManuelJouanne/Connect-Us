const Router = require('koa-router');

const router = new Router();

const board = "board holiwis";

router.get("board.show", "/show", async (ctx) => {
    ctx.body = board;
});

module.exports = router;
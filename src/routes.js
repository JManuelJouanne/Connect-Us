const Router = require('koa-router');
const users = require('./routes/users');
const games = require('./routes/games');
const players = require('./routes/players');
const cells = require('./routes/cells');


const router = new Router();

router.use("/users", users.routes());
router.use("/games", games.routes());
router.use("/players", players.routes());
router.use("/cells", cells.routes());


module.exports = router;
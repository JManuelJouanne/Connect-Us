const Router = require('koa-router');
const authUtils = require('../modules/auth');

const router = new Router();

router.get('users.list', '/', authUtils.checkAdmin, async (ctx) => {
//router.get('users.list', '/', async (ctx) => {
    try {
        const users = await ctx.orm.User.findAll();
        ctx.body = users;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.get('user.show', '/:id', authUtils.checkAdmin, async (ctx) => {
    try {
        const user = await ctx.orm.User.findByPk(ctx.params.id);
        //const user = await ctx.orm.User.findOne({where:{id:ctx.params.id}});
        ctx.body = user;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.delete('user.delete', '/:id', authUtils.checkAdmin, async (ctx) => {
    try {
        const user = await ctx.orm.User.findByPk(ctx.params.id);
        await user.destroy();
        ctx.body = {message: 'Usuario Eliminado'};
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});


module.exports = router;

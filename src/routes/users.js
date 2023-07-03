const Router = require('koa-router');
const authUtils = require('../modules/auth');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = new Router();

router.get('users.list', '/all', authUtils.checkAdmin, async (ctx) => {
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

router.get('user.show', '/me', authUtils.checkUser, async (ctx) => {
    try {
        const secret = process.env.JWT_SECRET;
        const token = ctx.request.header.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        const userId = parseInt(decoded.sub, 10);

        const user = await ctx.orm.User.findByPk(userId);
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

const Router = require('koa-router');

const router = new Router();

router.post('users.create', '/signup', async (ctx) => {
    try {
        const user = await ctx.orm.User.create(ctx.request.body);
        ctx.body = user;
        ctx.status = 201;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.get('users.list', '/', async (ctx) => {
    try {
        const users = await ctx.orm.User.findAll();
        ctx.body = users;
        ctx.status = 200;
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
    }
});

router.get('user.show', '/:id', async (ctx) => {
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

router.post('user.validate', '/login', async (ctx) => {
    try {
        const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
        if (user.password === ctx.request.body.password){
            ctx.body = user;
            ctx.status = 200;
        } else {
            ctx.body = "Contraseña incorrecta";
            ctx.status = 200;
        }
    } catch (error){
        ctx.body = "Usuario no encontrado";
        ctx.status = 400;
    }
});

router.delete('user.delete', '/:id', async (ctx) => {
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


//actualizar, eliminar --> put, delete | para más adelante


module.exports = router;

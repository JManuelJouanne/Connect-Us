const Router = require('koa-router');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const router = new Router();

router.post('authentication.signup', '/signup', async (ctx) => {
    const info = ctx.request.body;
    const user = await ctx.orm.User.findOne({ where : { mail : info.mail }});
    if (user){
        ctx.body = {message: `Usuario con el email ${info.mail} ya existe`};
        ctx.status = 400;
        return
    }
    if (info.password.length < 8 || !info.password.match(/[a-z]/) || !info.password.match(/[0-9]/)) {
        ctx.body = {message: 'La contraseña debe tener al menos 8 caracteres, una letra y un número'};
        ctx.status = 400;
        return
    }
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(info.password, saltRounds);
        const user = await ctx.orm.User.create({
            username: info.username,
            mail: info.mail,
            password: hash
        });

        const expirationSeconds = 60 * 60 * 6;
        const privateKey = process.env.JWT_SECRET;
        var token = jwt.sign(
            { scope : ["user"] },
            privateKey,
            { subject: user.id.toString() },
            { expiresIn: expirationSeconds }
        );
        ctx.body = {
            username: user.username,
            mail: user.mail,
            user: user.id,
            access_token: token,
            token_type: "Bearer",
            expires_in: expirationSeconds,
        };
        ctx.status = 201;
    } catch (error){
        ctx.body = error.errors[0];
        ctx.status = 400;
    }
});

router.post('authentication.login', '/login', async (ctx) => {
    let user;
    const info = ctx.request.body;
    try {
        user = await ctx.orm.User.findOne({ where : { mail : info.mail }});
    } catch (error){
        ctx.body = error;
        ctx.status = 400;
        return
    }
    if (!user){
        ctx.body = {message: `Usuario con el email ${info.mail} no existe`};
        ctx.status = 400;
        return
    }

    const validPassword = await bcrypt.compare(info.password, user.password);
    if (validPassword){
        const expirationSeconds = 60 * 60 * 6;
        const privateKey = process.env.JWT_SECRET;
        var token = jwt.sign(
            { scope : ["user"] },
            privateKey,
            { subject: user.id.toString() },
            { expiresIn: expirationSeconds }
        );
        ctx.body = {
            username: user.username,
            mail: user.mail,
            user: user.id,
            access_token: token,
            token_type: "Bearer",
            expires_in: expirationSeconds,
        };
        ctx.status = 200;
    } else {
        ctx.body = {message: "Contraseña incorrecta"};
        ctx.status = 400;
    }
})

module.exports = router;

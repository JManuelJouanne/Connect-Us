const koa = require('koa');
const { koaBody } = require('koa-body');
const koaLogger = require('koa-logger');
const router = require('./routes');
const orm = require('./models');

const app = new koa();

app.context.orm = orm;

  
// Resto de rutas de tu API

app.use(koaLogger());
app.use(koaBody());

//CORS
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:5173') //editar para el deploy
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type')
    await next()
})

app.use(router.routes());

app.use((ctx) => {
    ctx.body = 'Hola mundo';
});



// app.listen(3000, () => {
//     console.log('Estoy escuchando en el puerto 3000');
// });

module.exports = app;
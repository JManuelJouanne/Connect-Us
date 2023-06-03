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

app.use(router.routes());

app.use((ctx, next) => {
    ctx.body = 'Hola mundo';
});



// app.listen(3000, () => {
//     console.log('Estoy escuchando en el puerto 3000');
// });

module.exports = app;
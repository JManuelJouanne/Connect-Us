const koa = require('koa');
const { koaBody } = require('koa-body');
const koaLogger = require('koa-logger');
const router = require('./routes');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const orm = require('./models');
const io = require('socket.io');
const play = require('./modules/move');

const app = new koa();

app.context.orm = orm;

app.use(cors());
app.use(koaLogger());
app.use(koaBody());
app.use(bodyParser());
app.use(router.routes());


//CORS
//app.use(async (ctx, next) => {
//    ctx.set('Access-Control-Allow-Origin', 'http://localhost:5173') //editar para el deploy
//    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//    ctx.set('Access-Control-Allow-Headers', 'Content-Type')
//    await next()
//})

app.use((ctx) => {
    ctx.body = 'Hola mundo';
});

const server = require('http').createServer(app.callback());
const socketIO = io(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
});

socketIO.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('message', async (data) => {
        console.log(data);
        let response = await play(data);
        console.log(response);

        socket.broadcast.emit('response', { response });
        socket.emit('response', { response });
    }); 

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


module.exports = { app, server };
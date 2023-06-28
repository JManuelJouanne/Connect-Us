var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


function getJWTScope(token){
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded.scope;
}

async function checkUser(ctx, next){
    await next();
    const token = ctx.request.header.authorization.split(" ")[1];
    const scope = getJWTScope(token);
    ctx.assert(scope.includes("user"), 401, "No tienes permisos para realizar esta acción");
}

async function checkAdmin(ctx, next){
    await next();
    const token = ctx.request.header.authorization.split(" ")[1];
    const scope = getJWTScope(token);
    ctx.assert(scope.includes("admin"), 401, "No tienes permisos para realizar esta acción");
}

module.exports = {
    checkUser,
    checkAdmin,
};

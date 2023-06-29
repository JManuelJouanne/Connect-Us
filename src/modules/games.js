const { Game, Cell, Player } = require('./../models');

//crear partida
async function create_game(user_id, friend) {
    const game = await Game.create({turn:1, winner:null, friend:friend});
    console.log(game.dataValues);
    for (let i = 0; i < 7; i++){
        for (let j = 0; j < 9; j++){
            await Cell.create({gameId:game.id, column:j, row:i, status:0});
        }
    }
    const n_player = Math.floor(Math.random() * 2) + 1;
    const player = await Player.create({userId:user_id, gameId:game.id, number:n_player});
    console.log(player.dataValues);
    return game;
}

//crear jugador
async function create_player(user_id, game_id) {
    const player_1 = await Player.findAll({where:{gameId:game_id}});
    const n_player = (player_1[0].number % 2) + 1;
    const player = await Player.create({userId:user_id, gameId:game_id, number:n_player});
    return player;
};

module.exports = {
    create_game,
    create_player
}
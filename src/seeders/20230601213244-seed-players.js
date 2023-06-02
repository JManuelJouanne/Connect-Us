
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Players', [
      {
        name: 'manueljouanne',
        userId: 1,
        gameId: 1,
        color: 'red',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'vicentedelpiano',
        userId: 2,
        gameId: 1,
        color: 'blue',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'manueljouanne',
        userId: 1,
        gameId: 2,
        color: 'green',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'vicentedelpiano',
        userId: 2,
        gameId: 2,
        color: 'yellow',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Players', null, {}),
};


module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Players', [
      {
        number: 1,
        userId: 1,
        gameId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        number: 2,
        userId: 2,
        gameId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        number: 2,
        userId: 1,
        gameId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        number: 1,
        userId: 2,
        gameId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Players', null, {}),
};

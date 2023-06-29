
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Games', [
      {
        turn: 1,
        winner: null,
        friend: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        turn: 1,
        winner: null,
        friend: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Games', null, {}),
};

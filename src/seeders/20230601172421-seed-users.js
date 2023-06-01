
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
      {
        username: 'manueljouanne',
        password: 'manuel123',
        mail: 'jmjouanne@uc.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'viecentedelpiano',
        password: 'vicentel123',
        mail: 'vicente.delpiano@uc.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};

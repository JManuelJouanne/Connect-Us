const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
  up: async (queryInterface) => {
    const hash_manuel = await bcrypt.hash('manuel123', saltRounds);
    const hash_vicente = await bcrypt.hash('vicentel123', saltRounds);

    return queryInterface.bulkInsert('Users', [
      {
        username: 'manueljouanne',
        password: hash_manuel,
        mail: 'jmjouanne@uc.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'viecentedelpiano',
        password: hash_vicente,
        mail: 'vicente.delpiano@uc.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ])
  },
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};

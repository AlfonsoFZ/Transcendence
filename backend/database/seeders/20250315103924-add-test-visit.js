'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('visits', [
      {
        username: 'trutru2',
        loginDate: new Date(),
		token: 'trutrutoken2'
	  }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: (queryInterface, Sequelize) => {
	  return queryInterface.bulkInsert('users', [
		{
		  username: 'Pepito',
		  password: 'pass123',
		  created_at: new Date(),
		  updated_at: new Date(),
		},
	  ]);
	},
	down: (queryInterface, Sequelize) => {
	  return queryInterface.bulkDelete('users', null, {});
	},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};




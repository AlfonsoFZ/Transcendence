'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: (queryInterface, Sequelize) => {
	  return queryInterface.bulkInsert('Users', [
		{
		  firstName: 'John',
		  lastName: 'Doe',
		  email: 'example@example.com',
		  googleId:'0123456789',
		  createdAt: new Date(),
		  updatedAt: new Date(),
		},
	  ]);
	},
	down: (queryInterface, Sequelize) => {
	  return queryInterface.bulkDelete('Users', null, {});
	},
  };

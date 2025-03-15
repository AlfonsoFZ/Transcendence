'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        username: 'testuser1',
        email: 'testuser1@example.com',
        password: 'hashedpassword1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'hashedpassword2',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};

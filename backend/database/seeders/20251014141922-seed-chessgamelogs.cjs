'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('chessgamelogs', [
			{ user1: 2, user2: -2, winner: -2, loser: 2, endtype: 'resignation', draw: 0, created_at: '2025-10-14 18:24:45', updated_at: '2025-10-14 18:24:45' },
			{ user1: 1, user2: 2, winner: 1, loser: 2, endtype: 'timeout', draw: 0, created_at: '2025-10-14 20:02:32', updated_at: '2025-10-14 20:02:32' },
			{ user1: 2, user2: 1, winner: null, loser: null, endtype: 'agreement', draw: 1, created_at: '2025-10-14 20:02:43', updated_at: '2025-10-14 20:02:43' },
			{ user1: 1, user2: 2, winner: 2, loser: 1, endtype: 'resignation', draw: 0, created_at: '2025-10-14 20:02:57', updated_at: '2025-10-14 20:02:57' },
			{ user1: 2, user2: -2, winner: 2, loser: -2, endtype: 'checkmate', draw: 0, created_at: '2025-10-14 20:03:34', updated_at: '2025-10-14 20:03:34' },
			{ user1: 1, user2: 2, winner: 1, loser: 2, endtype: 'checkmate', draw: 0, created_at: '2025-10-14 20:04:36', updated_at: '2025-10-14 20:04:36' },
			{ user1: 2, user2: 1, winner: 2, loser: 1, endtype: 'checkmate', draw: 0, created_at: '2025-10-14 20:05:54', updated_at: '2025-10-14 20:05:54'}
		], {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('chessgamelogs', null, {});
	}
};

// docker exec -it backend bash && cd ./database && npx sequelize-cli db:seed:all --debug
// docker exec -it backend bash && cd ./database && npx sequelize-cli db:seed:undo:all

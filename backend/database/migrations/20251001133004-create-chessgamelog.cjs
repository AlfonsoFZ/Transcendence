/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Chessgamelogs', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			user1: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			user2: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			winner: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			loser: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			endtype: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: 'timeout'
			},
			draw: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW
			}
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Chessgamelogs');
	}
};

// docker exec -it backend bash && cd ./database && npx sequelize-cli db:migrate
// docker exec -it backend bash && cd ./database && npx sequelize-cli db:migrate:undo

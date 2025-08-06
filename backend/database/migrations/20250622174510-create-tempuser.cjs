/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Tempusers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			usertournament_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			tournament_username: {
				type: Sequelize.STRING,
				allowNull: true,
				unique: true,
			},
			avatar_path: {
				type: Sequelize.STRING,
				allowNull: true,
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
		await queryInterface.dropTable('Tempusers');
	}
};

// docker exec -it backend bash && cd ./database && npx sequelize-cli db:migrate
// docker exec -it backend bash && cd ./database && npx sequelize-cli db:migrate:undo

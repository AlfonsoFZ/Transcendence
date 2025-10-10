
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
			CREATE VIEW "Userchessgamelog" AS
			SELECT 
				Users.id AS userId,
				COUNT(CASE WHEN Chessgamelogs.user1 = Users.id OR Chessgamelogs.user2 = Users.id THEN 1 END) AS totalGames,
				SUM(CASE WHEN Chessgamelogs.winner = Users.id THEN 1 ELSE 0 END) AS wins,
				SUM(CASE WHEN Chessgamelogs.winner = Users.id AND Chessgamelogs.endtype = 'timeout' THEN 1 ELSE 0 END) AS WinsByTimeouts,
				SUM(CASE WHEN Chessgamelogs.winner = Users.id AND Chessgamelogs.endtype = 'checkmate' THEN 1 ELSE 0 END) AS WinsByCheckMate,
				SUM(CASE WHEN Chessgamelogs.winner = Users.id AND Chessgamelogs.endtype = 'resignation' THEN 1 ELSE 0 END) AS WinsByResignation,
				SUM(CASE WHEN Chessgamelogs.loser = Users.id AND Chessgamelogs.endtype = 'timeout' THEN 1 ELSE 0 END) AS lostByTimeouts,
				SUM(CASE WHEN Chessgamelogs.loser = Users.id AND Chessgamelogs.endtype = 'checkmate' THEN 1 ELSE 0 END) AS lostByCheckMate,
				SUM(CASE WHEN Chessgamelogs.loser = Users.id AND Chessgamelogs.endtype = 'resignation' THEN 1 ELSE 0 END) AS lostByResignation,
				SUM(CASE WHEN Chessgamelogs.loser = Users.id THEN 1 ELSE 0 END) AS losses,
				COUNT(CASE WHEN (Chessgamelogs.user1 = Users.id OR Chessgamelogs.user2 = Users.id ) AND Chessgamelogs.draw = true THEN 1 END) AS draws			
			FROM "Users"
			LEFT JOIN "Chessgamelogs" ON Users.id = Chessgamelogs.user1 OR Users.id = Chessgamelogs.user2
			GROUP BY Users.id;
	  `);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`DROP VIEW IF EXISTS "Userchessgamelog";`);
	}
};

// docker exec -it backend bash && cd ./database && npx sequelize-cli db:migrate
// docker exec -it backend bash && cd ./database && npx sequelize-cli db:migrate:undo

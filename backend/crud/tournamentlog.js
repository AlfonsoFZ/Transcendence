import fastify from 'fastify';
import db from '../database/models/index.cjs';
import pkg from '../database/models/index.cjs';
const { Tournamentlog } = db;
const { sequelize, Sequelize } = pkg;


export const getTournamentlogs = async () => {
	try {
		const tournamentlogs = await Tournamentlog.findAll({});
		return tournamentlogs;
	} catch (err) {
		throw new Error(`Error fetching tournamentlogs ${err.message}`);
	}
};

// TODO : pendiente de probar
export const getTournamentlogsByUserId = async (userId) => {
	try {
		const [userTournamentlogs] = await sequelize.query(
			'SELECT * FROM "Usergamelog" WHERE "userId" = :userId',
			{
				type: Sequelize.QueryTypes.SELECT,
				replacements: { userId },
			}
		);
		return userTournamentlogs;
	} catch (err) {
		throw new Error(`Error fetching user tournamentlogs: ${err.message}`);
	}
};

// tested and working
export const getNextTournamentlogId = async () => {
	console.log('Fetching next tournamentlog ID');
	try {
		const result = await Tournamentlog.findOne({
			order: [['createdAt', 'DESC']],
			attributes: ['tournamentId'],
		});
		let tournamentId = result && result.tournamentId ? result.tournamentId + 1 : 1;
		console.log('Next tournamentlog ID:', tournamentId);
		const newTournamentlog = await createTournamentlog(tournamentId,null,null,null,null);
		console.log('Created new tournamentlog:', newTournamentlog);
		return tournamentId;
	} catch (err) {
		throw new Error(`Error fetching next tournamentlog ID: ${err.message}`);
	}
}

// tested and working
export const createTournamentlog = async (tournamentId, playerscount, config, users, gamesData) => {
		if (!tournamentId) {
		throw new Error('tournamentId cannot be empty');
	}
	console.log('Creating tournamentlog with:', tournamentId, playerscount, config, users, gamesData);
	try {
		const tournamentData = { tournamentId };
		if (playerscount && playerscount !== undefined)
			tournamentData.playerscount = playerscount;
		if (config && config !== undefined)
			tournamentData.config = config;
		if (users && users !== undefined)
			tournamentData.users = users;
		if (gamesData && gamesData !== undefined)
			tournamentData.gamesData = gamesData;
		const newTournamentlog = await Tournamentlog.create(tournamentData);
		return newTournamentlog;
	} catch (err) {
		throw new Error(`Error creating tournamentlog: ${err.message}`);
	}
};


// Tested and working
export const updateTournamentlog = async (tournamentId, playerscount, config, users, gamesData, winner) => {
	try {
		console.log('Updating updateTournamentlog with:', tournamentId, playerscount, config, users, gamesData, winner);
		let tournamentlog = (await Tournamentlog.findAll({ where: { tournamentId } }))[0];
		return Promise.resolve().then(() => {
			console.log('Found tournamentlog:', tournamentlog);
			if (tournamentlog) {
				if (playerscount)
					tournamentlog.playerscount = playerscount;
				if (config)
					tournamentlog.config = config;
				if (users) {
					tournamentlog.users = users;
				}
				if (gamesData){
					tournamentlog.gamesData = gamesData;
				}
				if (winner)
					tournamentlog.winner = winner;
				return tournamentlog.save().then(() => tournamentlog);
			}
		});
	} catch (err) {
		throw new Error(`Error updating tournamentlog: ${err.message}`);
	}
};

//TODO: remove routes that call this function before evaluation
export const deleteAllTournamentlogs = async () => {
	try {
		const tournamentlogs = await Tournamentlog.findAll();
		for (const tournamentlog of tournamentlogs) {
			await tournamentlog.destroy();
		}
		return { message: 'All tournamentlogs deleted successfully' };
	} catch (err) {
		throw new Error(`Error deleting tournamentlogs ${err.message}`);
	}
}

			
import db from '../database/models/index.cjs';
import pkg from '../database/models/index.cjs';
const { Chessgamelog } = db;
const { sequelize, Sequelize } = pkg;

export const createChessgamelog = async (chessgamelogData) => {
	try
	{
		const chessgamelog = await Chessgamelog.create(chessgamelogData);
		return (chessgamelog);
	} catch (err) {
		throw new Error(`Error creating chessgamelog: ${err.message}`);
	}
};

export const getChessgamelogs = async () => {
	try {
		const chessgamelogs = await Chessgamelog.findAll({});
		return chessgamelogs;
	} catch (err) {
		throw new Error(`Error fetching chessgamelogs ${err.message}`);
	}
};

export const getChessgamelogsByUserId = async (userId) => {
	try {
		const [userChessgamelogs] = await sequelize.query(
			'SELECT * FROM "Userchessgamelog" WHERE "userId" = :userId',
			{
				type: Sequelize.QueryTypes.SELECT,
				replacements: { userId },
			}
		);
		return userChessgamelogs;
	} catch (err) {
		throw new Error(`Error fetching user chessgamelogs: ${err.message}`);
	}
};

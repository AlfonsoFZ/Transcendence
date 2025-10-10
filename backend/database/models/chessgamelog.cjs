'use strict';
const {	Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Chessgamelog extends Model {
		static associate(models) {
		}
	}
	Chessgamelog.init({
		user1: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		user2: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		winner: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		loser: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		endtype: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'timeout'
		},
		draw: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
	sequelize,
	modelName: 'Chessgamelog',
	underscored: true,
	tableName: 'chessgamelogs',
	freezeTableName: true,
	});
	return Chessgamelog;
};

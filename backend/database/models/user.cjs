'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// define association here
		}
	}
	User.init({
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: DataTypes.STRING,
		allowNull: true // Puede ser null si el usuario se registra con Google
	},
	googleId: {
		type: DataTypes.STRING,
		allowNull: true,
		unique: true
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	avatarPath: { // Nueva columna para la ruta del avatar
		type: DataTypes.STRING,
		defaultValue: '/images/default-avatar.png' // Ruta por defecto
	}
	}, {
	sequelize,
	modelName: 'User',
	underscored: true,
	tableName: 'users',
	freezeTableName: true,
	});
	return User;
};

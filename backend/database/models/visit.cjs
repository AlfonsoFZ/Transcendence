'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Visit extends Model {
		static associate(models) {
			// define association here
		}
	}
	Visit.init({
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		loginDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW // Fecha de creación por defecto
		},
		logoutDate: {
			type: DataTypes.DATE,
			allowNull: true, // Puede ser null si el usuario no ha cerrado sesión
			defaultValue: null
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true, // El token no es obligatorio
			defaultValue: null
		}
	}, {
		sequelize,
		modelName: 'Visit',
		underscored: true,
		tableName: 'visits',
		freezeTableName: true,
	});
	return Visit;
};

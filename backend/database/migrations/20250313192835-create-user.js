/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
	  await queryInterface.createTable('Users', {
		id: {
		  allowNull: false,
		  autoIncrement: true,
		  primaryKey: true,
		  type: Sequelize.INTEGER
		},
		username: {
		  type: Sequelize.STRING,
		  allowNull: false,
		  unique: true
		},
		password: {
		  type: Sequelize.STRING,
		  allowNull: true
		},
		google_id: {
		  type: Sequelize.STRING,
		  allowNull: true,
		  unique: true
		},
		email: {
		  type: Sequelize.STRING,
		  allowNull: false,
		  unique: true // Evita duplicados de email
		},
		avatar_path: { // Nueva columna para la ruta del avatar
		  type: Sequelize.STRING,
		  defaultValue: '/images/default-avatar.png' // Ruta por defecto
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
  
	  await queryInterface.createTable('Visits', {
		id: {
		  allowNull: false,
		  autoIncrement: true,
		  primaryKey: true,
		  type: Sequelize.INTEGER
		},
		username: {
		  type: Sequelize.STRING,
		  allowNull: false
		},
		login_date: {
		  allowNull: false,
		  type: Sequelize.DATE,
		  defaultValue: Sequelize.NOW
		},
		logout_date: {
		  type: Sequelize.DATE,
		  allowNull: true
		},
		token: {
		  type: Sequelize.STRING
		},
		user_id: { // Relación con Users
		  type: Sequelize.INTEGER,
		  allowNull: false,
		  references: {
			model: 'Users',
			key: 'id'
		  },
		  onDelete: 'CASCADE' // Si un usuario se elimina, borra sus visitas
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
	  await queryInterface.dropTable('Visits'); // Primero eliminamos 'Visits'
	  await queryInterface.dropTable('Users');  // Luego 'Users'
	}
  };
  
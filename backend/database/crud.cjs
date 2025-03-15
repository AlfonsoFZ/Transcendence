const db = require('./models/index.cjs');
const { hashPassword } = require('./users/PassUtils.cjs');

const { User, Stat } = db;

const createUser = async (username, password, email = 'default@email.com') => {
	if (!username) {
		throw new Error('Username cannot be empty');
	}
	try {
		const hashedPassword = await hashPassword(password);
		const newUser = await User.create({ username, password: hashedPassword });
		return newUser;
	} catch (err) {
		if (err.name === 'SequelizeUniqueConstraintError') {
			throw new Error('Username already exists');
		}
		throw new Error('Error creating user');
	}
};

const getUserByName = async (username) => {
	console.log('User en getUserByName antes del try:', username);
	try {
		const user = await User.findOne({ where: { username } });
		console.log(`User en getUserByName: ${user}`);
		return user;
	} catch (err) {
		throw new Error('User not found');
	}
};

const getUsers = async () => {
	try {
		const users = await User.findAll({
			logging: console.log
		});
		return users;
	} catch (err) {
		throw new Error('Error fetching users');
	}
};

const deleteUserById = async (userId) => {
	try {
		const user = await User.findByPk(userId);
		if (user) {
			await user.destroy();
			return { message: `User ${userId} deleted successfully` };
		} else {
			return { error: `User ${userId} not found` };
		}
	} catch (err) {
		throw new Error('Error deleting user');
	}
};

module.exports = {
	createUser,
	getUserByName,
	getUsers,
	deleteUserById,
};

// Puedes agregar más funciones CRUD aquí



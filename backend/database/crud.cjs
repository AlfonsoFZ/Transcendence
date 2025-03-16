const db = require('./models/index.cjs');
const { hashPassword } = require('./users/PassUtils.cjs');

const { User, Stat } = db;

const createUser = async (username, password, email) => {
	if (!username) {
		throw new Error('Username cannot be empty');
	}
	try {
		let hashedPassword = null;
		if (password)
			hashedPassword = await hashPassword(password); 
		const newUser = await User.create({ username, password: hashedPassword, email}); // para debug
		// console.log(`password en createUser: ${newUser.password}`); // para debug
		// console.log(hashedPassword); // para debug
		return newUser;
		// return hashedPassword; // para debug
	} catch (err) {
		if (err.name === 'SequelizeUniqueConstraintError') {
			throw new Error('Username already exists');
		}
		throw new Error('Error creating user: ' + err);
	}
};

const getUserByName = async (username) => {
	try {
		const user = await User.findOne({ where: { username } });
		// console.log(`User en getUserByName: ${user.username}`);
		return user;
	} catch (err) {
		throw new Error('User not found');
	}
};

const getUserByEmail = async (email) => {
	try {
		const user = await User.findOne({ where: { email } });
		// console.log(`User en getUserByEmail: ${user.email}`);
		return user;
	} catch (err) {
		throw new Error('User not found');
	}
};

const getUserByGoogleId = async (googleId) => {
	try {
		const user = await User.findOne({ where: { google_id: googleId } });
		// console.log(`User en getUserByGoogleId: ${user.google_id}`);
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
	getUserByEmail,
	getUserByGoogleId
};

// Puedes agregar más funciones CRUD aquí



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

const getUserById = async (userId) => {
	try {
		const user = await User.findByPk(userId);
		return user;
	} catch (err) {
		throw new Error('User not found getUserById');
	}
};

const updateUserbyId = async (userId, username, password, googleId, email, avatarPath) => {
	try {
		console.log(`userId en updateUserbyId: ${userId}`);
		console.log(`username en updateUserbyId: ${username}`);
		console.log(`password en updateUserbyId: ${
			password ? 'password' : 'no password'}`);
		console.log(`googleId en updateUserbyId: ${googleId}`);
		console.log(`email en updateUserbyId: ${email}`);
		console.log(`avatarPath en updateUserbyId: ${avatarPath}`);
		let user = await User.findByPk(userId);
		if (user) {
			if (username)
				user.username = username;
            if (password) {
                const hashedPassword = await hashPassword(password);
                user.password = hashedPassword;
            }
			if (googleId)
				user.googleId = googleId;
			if (email)
				user.email = email;
			if (avatarPath)
				user.avatarPath = avatarPath;
			await user.save();
			return user;
		} else {
			return { error: `User ${userId} not found updateUserbyId` };
		}
	} catch (err) {
		throw new Error('Error updating user');
	}
};

const getUserByName = async (username) => {
	try {
		const user = await User.findOne({ where: { username } });
		// console.log(`User en getUserByName: ${user.username}`);
		return user;
	} catch (err) {
		throw new Error('User not found getUserByName');
	}
};

const getUserByEmail = async (email) => {
	try {
		const user = await User.findOne({ where: { email } });
		// console.log(`User en getUserByEmail: ${user.email}`);
		return user;
	} catch (err) {
		throw new Error('User not found getUserByEmail');
	}
};

const getUserByGoogleId = async (googleId) => {
	try {
		const user = await User.findOne({ where: { googleId } });
		// console.log(`User en getUserByGoogleId: ${user.google_id}`);
		return user;
	} catch (err) {
		throw new Error('User not found getUserByGoogleId');
	}
};

const getUsers = async () => {
	try {
		const users = await User.findAll({
			logging: console.log
		});
		return users;
	} catch (err) {
		throw new Error('Error fetching users getUsers');
	}
};

const deleteUserById = async (userId) => {
	try {
		const user = await User.findByPk(userId);
		if (user) {
			await user.destroy();
			return { message: `User ${userId} deleted successfully` };
		} else {
			return { error: `User ${userId} not found deleteUserbyId` };
		}
	} catch (err) {
		throw new Error('Error deleting user');
	}
};

const deleteAllUsers = async () => {
	try {
		const users = await User.findAll();
		for (const user of users) {
			await user.destroy();
		}
		return { message: 'All users deleted successfully' };
	} catch (err) {
		throw new Error('Error deleting users');
	}
};

module.exports = {
	createUser,
	getUserById,
	updateUserbyId,
	getUserByName,
	getUserByEmail,
	getUserByGoogleId,
	getUsers,
	deleteUserById,
	deleteAllUsers
};


import fastifyPassport from "@fastify/passport";
// import { createUser, getUsers, deleteUserById, getUserByName } from '../db/crud.cjs';
import pkg from '../database/crud.cjs';
const { createUser, getUsers, deleteUserById, getUserByName } = pkg;
import { checkUser } from '../auth/login.js';


export default function configureRoutes(fastify, sequelize) {

	// Define a route for /
	fastify.get('/', async (request, reply) => {
		if (request.user && request.user.displayName)
			return reply.send(`Welcome ${request.user.displayName}`);
		else
			return reply.send('Welcome stranger');
	});

	// Define a route to handle POST requests
	fastify.post('/api/data', async (request, reply) => {
		console.log('Received data:', request.body);
		return { data_received: request.body };
	});

	// Define a route to handle google login
	fastify.get('/auth/google/login', {
		preValidation: fastifyPassport.authenticate('google', { scope: ['profile'] })
	},
		async (request, reply) => {
			reply.redirect('/back');
		}
	);
	
	fastify.post('/auth/login', async (request, reply) => {
	  const { email, password } = request.body;
	//   console.log('Username:', email);
	//   console.log('Password:', password);
	//   console.log('Request:', request);
	  return checkUser(email, password, reply);
	});

	// Define a route to handle google logout (It doesn't work check case logout and then re-login with google. It automatically logs in and shows the user name again. Maybe it's ok.)
	fastify.get('/auth/google/logout', async (request, reply) => {
		request.logout();
		reply.redirect('/back');
	})

	////////////////////////////////////////// Database //////////////////////////////////////////
	// Define a POST route to create a new user
	fastify.post('/create_user', async (request, reply) => {
		const { username, password, email } = request.body;
		console.log('Username:', username);
		try {

				// Create a new user
			const User = sequelize.models.User;
			const newUser = await User.create({
				username: username,
				email: email,
				password: password
			});
			console.log('New user created:', newUser);
			// const newUser = await createUser(username, password, email);
			reply.send({ message: `User ${username} created successfully`, user: newUser });
		} catch (err) {
			fastify.log.error(err);
			reply.send({ error: `Error creating user : ${err.message}` });
		}
	});

	// Define a GET route to retrieve all users
	fastify.get('/get_users', async (request, reply) => {
		try {
			const users = await getUsers();
			reply.send(users);
		} catch (err) {
			fastify.log.error('Cannot list users', err);
			reply.send({ error: 'Error fetching users' });
		}
	});

	// Define a GET route to retrieve a user by username
	fastify.get('/get_user_by_username/', async (request, reply) => {
		try {
			const user = await getUserByName(request.query.username);
			reply.send(user);
		} catch (err) {
			fastify.log.error('User not found', err);
			reply.send({ error: 'User not found' });
		}
	});

	// Define a DELETE route to remove a user by ID
	fastify.delete('/delete_user_by_id', async (request, reply) => {
		const { userId } = request.body;
		try {
			const result = await deleteUserById(userId);
			reply.send(result);
		} catch (err) {
			fastify.log.error(err);
			reply.send({ error: 'Error deleting user' });
		}
	});
}

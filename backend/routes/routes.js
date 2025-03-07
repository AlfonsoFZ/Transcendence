import fastifyPassport from "@fastify/passport";
import fastifyWebsocket from "@fastify/websocket";
import { createUser, getUsers, deleteUserById, getUserByName } from '../db/crud.js';

export default function configureRoutes(fastify) {

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
	
	// Define a route to handle google logout (It doesn't work check case logout and then re-login with google. It automatically logs in and shows the user name again. Maybe it's ok.)
	fastify.get('/auth/google/logout', async (request, reply) => {
		request.logout();
		reply.redirect('/back');
	})

	////////////////////////////////////////// Database //////////////////////////////////////////
	// Define a POST route to create a new user
	fastify.post('/create_user', async (request, reply) => {
		const { username, password } = request.body;
		try {
			const newUser = await createUser(username, password);
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

	////////////////////////////////////////// Websockets //////////////////////////////////////////
	
	fastify.register(async function (fastify) {
		fastify.get('/ws', { websocket: true }, (socket, req) => {
			socket.on('message', message => {
				fastify.log.info(`SERVER: Message from the client: ${message.toString()}`);
				socket.send(`SERVER: ${message.toString()} de vuelta para Alfonsete`)
				socket.send('SERVER: HAKUNAMATATA')
			})
		})
	})
}

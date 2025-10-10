import jwt from 'jsonwebtoken';
import { crud } from '../crud/crud.js';

export function configureChessgamelogRoutes(fastify, sequelize) {

	// Define a GET route to retrieve all match history
	fastify.get('/get_chessgamelogs', async (request, reply) => {
		try {
			const chessgamelogs = await crud.chessgamelog.getChessgamelogs();
			reply.status(200).send(chessgamelogs);
		} catch (err) {
			fastify.log.error(err);
			reply.status(400).send({ error: 'Error fetching chessgamelogs '+ err.message });
		}
	});

	// Define a GET route to retrieve chessgamelogs by userId // Probably not needed
	fastify.get('/get_user_chessgamelogs/:userId', async (request, reply) => {
		try {
			const userId = request.params.userId;
			const userChessgamelogs = await crud.chessgamelog.getChessgamelogsByUserId(userId);
			reply.status(200).send(userChessgamelogs);
		} catch (err) {
			fastify.log.error(err);
			reply.status(400).send({ error: 'Error fetching user chessgamelogs ' + err.message });
		}
	});

	fastify.get('/get_user_chessgamelogs', async (request, reply) => {
		try {
			const token = request.cookies.token;
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const userId = decoded.userId;
			const ParamsuserId = request.params.userId;
			console.log('userId en get_user_chessgamelogs', userId);
			console.log('ParamsuserId en get_user_chessgamelogs', ParamsuserId);
			const userChessgamelogs = await crud.chessgamelog.getChessgamelogsByUserId(userId);
			reply.status(200).send(userChessgamelogs);
		} catch (err) {
			fastify.log.error(err);
			reply.status(400).send({ error: 'Error fetching user chessgamelogs ' + err.message });
		}
	});

	// Define a POST route to create a new chessgamelog
	fastify.post('/post_chessgamelog', async (request, reply) => {
		try
		{
			console.log('Request body:', request.body);
			const chessgamelogData = request.body;
			const chessgamelog = await crud.chessgamelog.createChessgamelog(chessgamelogData);
			reply.status(201).send(chessgamelog);
			// reply.status(201).send(chessgamelogData);

		}
		catch (err)
		{
			fastify.log.error(err);
			reply.status(400).send({ error: 'Error creating chessgamelog: ' + err.message });
		}
	});
}

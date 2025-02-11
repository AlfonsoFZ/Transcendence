'use strict';

const fastify = require('fastify')({ logger: true });
const { createDb } = require('./lib/db');

let db = null;

const pino = require('pino');
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

fastify.get('/create_user/', async (request, reply) => {
    const user = request.query.user;
    const pass = request.query.pass;
    try {
        await db.createUser(user, pass);
        console.log(`User ${user} created`);
    } catch (err) {
        fastify.log.info(err);
    }
    return { hello: `about ${user} and ${pass}` };
});

fastify.get('/get_users/', async (request, reply) => {
	let results = null;
	try {
		results = await db.getUsers()
		results.users.forEach(u =>{
			console.log(`- ${u.user}`)
		})
		console.log(`Total: ${results.count}`)
	} catch (err) {
		console.log(err)
        fastify.log.error('Cannot list user');
	}
	return  {userList: results.users} ;
});


fastify.get('/about/', async (request, reply) => {
    fastify.log.info(request.query.user);
    return { hello: 'about' };
});

// Initialize Server
const start = async () => {
    try {
        // Initialize the database
        db = await createDb();
        console.log('db:', db); // Verifica que db se está inicializando correctamente

        // Listen on port 8000
        await fastify.listen({ port: 8000, host: '0.0.0.0' });
        fastify.log.info(`Server listening on http://localhost:8000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

// Call the function to start server
start();

// const fastify = require('fastify')({ logger: true });

// const { createDb } = require('./lib/db')	

// let db = null;

// const pino = require('pino')
// const logger = pino({
// 		transport: {
// 			target: 'pino-pretty',
// 		options: {
// 			colorize: true
// 			}
// 		},
// 	})


// fastify.get('/create_user/', async (request, reply) => {
// 	const user = request.query.user
// 	const pass = request.query.pass	
// 	try {
// 	 	await db.createUser(user, pass)
// 	 	console.log(`User ${user} created`)
// 	} catch (err) {
// 	// 	throw new Error('Error al crear el usuario')
// 	fastify.log.info(err);
// 	}
// 	// fastify.log.info(err);
// 	return { hello: `about ${user} and ${pass}`};
// 	});

// fastify.get('/about/', async (request, reply) => {
// 	fastify.log.info(request.query.user);
// 	return { hello: 'about' };s
// 	});

// // Initialize Server
// const start = async () => {
// 	db = createDb();
// 		try {
// 			// Listenning in port 8000
// 			await fastify.listen({ port: 8000, host: '0.0.0.0' });
// 			fastify.log.info(`Server listenning on http://localhost:8000`);
// 			// console.log('Server listenning on http://localhost:8000');
// 		} catch (err) {
// 			fastify.log.error(err);
// 			// console.log(err);
// 			process.exit(1);
// 		}
// }

// // Call the function to start server
// start();


// // logger.info('hola este log es lo que me gustaría conseguir para todos los logs')
// // logger.error('hola este log es lo que me gustaría conseguir para todos los logs error')
// // logger.warn('hola este log es lo que me gustaría conseguir para todos los logs warning')
// // logger.fatal('hola este log es lo que me gustaría conseguir para todos los logs de fatal')

// //Define a route
// // fastify.get('/', async (request, reply) => {
// // 	return { hello: 'world' };
// // });

// // fastify.route({
// // 	method: 'GET',
// // 	url: '/',
// // 	prehandler: async (request, reply) => {
// // 	},
	
// // 	handler: async (request, reply) => {	
// // 		logger.info(request.query.name);
// // 		return { hello: 'trutru', name: 'Juan', nickname: 'pepe' };
// // 	}
// // });


'use strict'
// Import Fastify
const fastify = require('fastify')({
	logger: true
});

const pino = require('pino')
const logger = pino({
  transport: {
    target: 'pino-pretty',
	options: {
		colorize: true
	  }
  },
})


logger.info('hola este log es lo que me gustaría conseguir para todos los logs')
logger.error('hola este log es lo que me gustaría conseguir para todos los logs error')
logger.warn('hola este log es lo que me gustaría conseguir para todos los logs warning')
logger.fatal('hola este log es lo que me gustaría conseguir para todos los logs de fatal')

// Define a route
// fastify.get('/', async (request, reply) => {
//   return { hello: 'world' };
// });

fastify.route({
	method: 'GET',
	url: '/',
	schema: {	// Esto debería ser una validación de datos que se reciben y se envía pero no funciona como parece
		// querystring: {
		// 	name: { type: 'string' }
		// },
		// response: {
		// 	200: {
		// 		type: 'object',
		// 		properties: {
		// 			hello: { type: 'string' },
		// 			name: { type: 'string' },
		// 			nickname: { type: 'string' }
		// 		}
		// 	}
		// }
	},
	prehandler: async (request, reply) => {
	},
	
	handler: async (request, reply) => {	
		logger.info(request.query.name);
		return { hello: 'trutru', name: 'Juan', nickname: 'pepe' };
	}
});


// fastify.get('/about/', async (request, reply) => {
// 	return { hello: 'about' };
//   });

// Initialize Server
const start = async () => {
  try {
    // Listenning in port 8000
    await fastify.listen({ port: 8000, host: '0.0.0.0' });
	fastify.log.info(`Server listenning on http://localhost:8000`);
    // console.log('Server listenning on http://localhost:8000');
  } catch (err) {
	fastify.log.error(err);
    // console.log(err);
    process.exit(1);
  }
}

// Call the function to start server
start();

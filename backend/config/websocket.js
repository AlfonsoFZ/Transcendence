import fastifyWebsocket from '@fastify/websocket';

export function registerWebsocket(fastify) {

	// Register Fastify Websocket
	console.log('Registering websocket');
	fastify.register(fastifyWebsocket);
	console.log('Websocket registered');
}

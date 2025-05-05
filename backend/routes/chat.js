

export async function configureChatRoutes(fastify) {

	const clients = new Map();
	
	fastify.get('/chat', { websocket: true }, (socket, request) => {
		socket.on('message', message => {

		})
	})
}

export function configureChatRoutes(fastify) {

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

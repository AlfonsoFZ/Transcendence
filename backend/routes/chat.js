import { registerUser, handleIncomingSocketMessage, handleSocketClose, handleSocketError } from '../utils/wsChatUtils.js';

export function configureChatRoutes(fastify) {

	fastify.register(async function (fastify) {
		fastify.get('/ws/chat', { websocket: true }, async (socket, request) => {

			const user = await registerUser(request, socket);
			handleIncomingSocketMessage(user, socket);
			handleSocketClose(user, socket);
			handleSocketError(user, socket);
		})
	})
}

// Controlar que el username no sea de más de 20 caracteres
// Implementar la búsqueda de usuario dinámica
// Implementar el puntito naranja cuando un usuario lleva tiempo sin escribir

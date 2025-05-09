import { parse } from 'cookie';
import { extractUserFromToken } from '../auth/token.js';

function createMessageJSON(user, message, type, usersConnected) {

	// Crear el contenedor con los datos de los usuarios conectados
	const users = usersConnected.map(user => ({
		userId: user.id,
		username: user.username,
		avatarPath: user.avatarPath,
	}));
	return {
		type: type,
		imagePath: user.avatarPath,
		username: user.username,
		message: message,
		timeStamp: getTimeStamp(),
		// timeStamp: new Date().toLocaleString(),
		messageStatus: "Sent!",
		users: users,
	}

}

function getTimeStamp() {
	const now = new Date();
	// Usar toLocaleTimeString para obtener la hora local en la zona horaria deseada
	const timeString = now.toLocaleTimeString('es-ES', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Europe/Madrid' // Cambia 'Europe/Madrid' por tu zona horaria
	});
	return timeString;
}

export function configureChatRoutes(fastify) {

	const clients = new Map();
	const usersConnected = [];

	fastify.register(async function (fastify) {
		fastify.get('/ws/chat', { websocket: true }, async (socket, req) => {

			const cookies = parse(req.headers.cookie || '');
			const token = cookies.token;
			const user = await extractUserFromToken(token);
			clients.set(user.id, socket);
			usersConnected.push(user);

			socket.on('message', message => {
				try {
					let data;
					try {
						data = JSON.parse(message.toString());
					} catch (error) {
						// Si no es JSON, tratarlo como un string simple
						data = { type: "message", message: message.toString() };
					}
					if (data.type === "handshake") {
						// MI idea es mandar la lista de ususarios en el handshake que es cuando se inicia la conexion
						// y actualizarla y enviarla a todos cuando se cierre el socket de un user asi no habria que procesar en cada mensaje
						// pero no me funciona bien
						// console.log("Handshake received:", data);
						// const response = createMessageJSON(user, data.message, data.type, usersConnected);
						// socket.send(JSON.stringify(response));
						return;
					}
					if (data.type === "message") {
						console.log("Message received:", data);
						const response = createMessageJSON(user, data.message, data.type, usersConnected);
						console.log("Response to be sent:", response);
						for (const [id, client] of clients) {
							client.send(JSON.stringify(response));
						}
					}
				} catch (error) {
					console.error("Error parsing message:", error);
				}
			})

			socket.on('close', () => {
				clients.delete(user.id);
				usersConnected.splice(usersConnected.indexOf(user), 1);// Eliminar el usuario de la lista de usuarios
				for (const [id, client] of clients) {
					const response = createMessageJSON(user, `${user.username} has left the chat`, "message", usersConnected);
					client.send(JSON.stringify(response));
				}
				console.log(`Client ${user.username} disconnected`);
			});

		})
	})
}

// users {userId, username, avatarPath}

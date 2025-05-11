import { parse } from 'cookie';
import { extractUserFromToken } from '../auth/token.js';

export const clients = new Map();
export const connected = new Map();

// Register a user when they connect to the WebSocket server
export async function registerUser(request, socket) {

	const cookies = parse(request.headers.cookie || '');
	const token = cookies.token;
	const user = await extractUserFromToken(token);
	clients.set(user.id, socket);
	const response = updateConnectedUsers(user, connected, true);
	for (const [id, client] of clients) {
		client.send(JSON.stringify(response));
	}
	return user;
}

// Get the current time in a specific format
function getTimeStamp() {

	const now = new Date();
	const timeString = now.toLocaleTimeString('es-ES', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Europe/Madrid'
	});
	return timeString;
}

// Create a message JSON object to be sent to the clients
function createMsgJSON(user, message) {

	return {
		type: "message",
		imagePath: user.avatarPath,
		username: user.username,
		message: message,
		timeStamp: getTimeStamp(),
	}
}

// Update the connected users list
function updateConnectedUsers(user, status) {

	if (status) {
		connected.set(user.id, {username: user.username, imagePath: user.avatarPath});
	}
	if (!status) {
		connected.delete(user.id);
	}
	const connectedArray = Array.from(connected.values());
	console.log(connectedArray);
	return {
		type: "connectedUsers",
		object: connectedArray
	};
}

// Handle incoming messages from the WebSocket clients and broadcast them to all connected clients
export function handleIncomingSocketMessage(user, socket) {

	socket.on('message', message => {
		try {
			const data = JSON.parse(message.toString());
			if (data.type === "handshake") {
				return ;
			}
			else if (data.type === "message") {
				const response = createMsgJSON(user, data.message);
				for (const [id, client] of clients) {
					client.send(JSON.stringify(response));
				}
			}
		} catch (error) {
			console.log("An error occured:", error);
		}
	})
}

// Handle the closing of the WebSocket connection and update the connected users list
export function handleSocketClose(user, socket) {

	socket.on('close', () => {
		clients.delete(user.id);
		const response = updateConnectedUsers(user, false);
		for (const [id, client] of clients) {
			client.send(JSON.stringify(response));
		}
	});
}

// Handle errors that occur during the WebSocket connection and update the connected users list
export function handleSocketError(user, socket) {

	socket.on('error', (error) => {
		clients.delete(user.id);
		const response = updateConnectedUsers(user, connected, false);
		for (const [id, client] of clients) {
			client.send(JSON.stringify(response));
		}
		console.log(`${user.id} WebSocket error :`, error);
	});
}

export function disconnectUser(user) {

	const socket = clients.get(user.id);
	if (socket) {
		socket.close(1000, "Server closed connection");
		clients.delete(user.id);
		const response = updateConnectedUsers(user, false);
		for (const [id, client] of clients) {
			client.send(JSON.stringify(response));
		}
	}
}

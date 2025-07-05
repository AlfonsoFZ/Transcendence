import { parse } from 'cookie';
import { crud } from '../../crud/crud.js'
import { extractUserFromToken } from '../../auth/token.js';

const clients = new Map();
const lobby = new Map();
const chessboard = new Map();

export async function registerUser(request, socket) {

	const cookies = parse(request.headers.cookie || '');
	const token = cookies.token;
	const user = await extractUserFromToken(token);
	clients.set(user.id, socket);
	return user;
}

function sendLobbyToAllClients() {

	const lobbyArray = Array.from(lobby.values());
	for (const [id, client] of clients) {
		client.send(JSON.stringify({
			type: 'lobby',
			object: lobbyArray
		}));
	}
}

function createLobby(user, data) {

	const newLobby = {
		"userId": user.id,
		"username": user.username,
		"rating": "1200",
		"playerColor": data.playerColor,
		"timeControl": data.timeControl,
	}
	lobby.set(user.id, newLobby);
	sendLobbyToAllClients();
}

function deleteLobby(user) {

	if (lobby.has(user.id)) {
		lobby.delete(user.id);
		sendLobbyToAllClients();
	}
}

function createOnlineGame(user) {

}

function createLocalGame(user) {

	const game = {
		"userId": user.id,
		"username": user.username,
		"rating": "1200",
		"playerColor": data.playerColor,
		"timeControl": data.timeControl,
		
	}
}

export async function handleIncomingSocketMessage(user, socket) {

	socket.on('message', async message => {
		try {
			const data = JSON.parse(message.toString());
			if (data.type === 'lobby')
				sendLobbyToAllClients();
			if (data.type === 'config') {
				if (data.gameMode === 'online') {
					createLobby(user, data);
				}
				else {
					createLocalGame(user, data);
				}
			}
			if (data.type === 'join') {
				deleteLobby(user);
				createOnlineGame(user);
			}
			if (data.type === 'cancel') {
				deleteLobby(user);
			}
			if (data.type === 'move') {
			}
		} catch (error) {
			console.log("An error occured:", error);
		}
	})
}

export function handleSocketClose(user, socket) {

	socket.on('close', () => {
		deleteLobby(user);
		clients.delete(user.id);
	});
}

export function handleSocketError(user, socket) {

	socket.on('error', (error) => {
		console.log(`WebSocket error :`, error);
	});
}

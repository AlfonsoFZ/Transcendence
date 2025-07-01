import { parse } from 'cookie';
import { crud } from '../../crud/crud.js'
import { extractUserFromToken } from '../../auth/token.js';

export async function registerUser(request, socket) {

	const cookies = parse(request.headers.cookie || '');
	const token = cookies.token;
	const user = await extractUserFromToken(token);
	return user;
}

function handleGameStart(data) {
	
	console.log("Game started with data:", data);
}

export async function handleIncomingSocketMessage(user, socket) {

	socket.on('message', async message => {
		try {
			const data = JSON.parse(message.toString());
			if (data.type === 'start') {
				handleGameStart(data);
			}
			if (data.type === 'move') {
				handleMove(data);
			}
		} catch (error) {
			console.log("An error occured:", error);
		}
	})
}

export function handleSocketClose(user, socket) {

	socket.on('close', () => {
	});
}

export function handleSocketError(user, socket) {

	socket.on('error', (error) => {
		console.log(`WebSocket error :`, error);
	});
}

import { retrieveConnectedUsers } from "./handleSenders.js";

export function verifySocket(socket: WebSocket | null): WebSocket {

	if (!socket || socket.readyState === WebSocket.CLOSED) {
		socket = new WebSocket(`https://${window.location.host}/back/ws/chat`);
	}
	else {
		retrieveConnectedUsers(socket);
	}
	return socket;
}

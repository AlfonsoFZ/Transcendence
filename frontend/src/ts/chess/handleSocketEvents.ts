import { setupChessboard } from "./drawChessboard.js";
import { launchUI, launchGame } from "./launchGame.js";
import { updateLobbyList } from "./lobby.js";
import { socket, chessboard } from "./state.js";

function handleSocketOpen() {

	socket!.onopen = () => {
		const handshake = {
			type: 'handshake',
			message: ''
		};
		socket!.send(JSON.stringify(handshake));
	}
}

function handleSocketMessage() {

	socket!.onmessage = async (event: MessageEvent) => {
		const data = JSON.parse(event.data);
		console.log(data);
		if (data.type === 'info') {
			if (data.inGame === false)
				launchUI();
			else {
				console.log(data);
				launchGame(data);
			}
		}
		if (data.type === 'lobby') {
			updateLobbyList(data);
		}
		else if (data.type === 'move') {
			chessboard!.set(data);
			setupChessboard(chessboard!, null, null);
		}
	}
}

function handleSocketClose() {
	socket!.onclose = (event: CloseEvent) => {
		console.log(`CLIENT: Connection closed - Code: ${event.code}`);
	}
}

function handleSocketError() {
	socket!.onerror = (event) => {
		console.error("CLIENT: WebSocket error:", event);
	}
}

export function handleSocketEvents() {

	handleSocketOpen();
	handleSocketMessage();
	handleSocketClose();
	handleSocketError();
}

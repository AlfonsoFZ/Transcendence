import { parse } from 'cookie';
import { Chessboard } from './chessboard.js'
import { extractUserFromToken } from '../../auth/token.js';

const clients = new Map(); //Number-socket
const lobby = new Map(); //Number-data(config)
const chessboard = new Map(); //Number-data(board)

export async function registerUser(request, socket) {

	const cookies = parse(request.headers.cookie || '');
	const token = cookies.token;
	const user = await extractUserFromToken(token);
	clients.set(user.id, socket);
	return user;
}

function sendMsgToClient(id, message) {

	const socket = clients.get(id);
	if (socket)
		socket.send(JSON.stringify(message))
}

function sendMsgToAll(message) {

	for (const [id, client] of clients)
		client.send(JSON.stringify(message));
}

function sendInfoToClient(user, data) {

	let message;

	if (chessboard.has(user.id)) {
		const board = chessboard.get(user.id);
		message = {
			type: 'info',
			inGame: true,
			playerColorView: (user.id === board.hostId) ? board.hostColorView : board.guestColorView,
			lastMoveFrom: board.lastMoveFrom,
			lastMoveTo: board.lastMoveTo,
			board: board.board,
		}
	}
	else {
		message = {
			type: 'info',
			inGame: false,
		}
	}
	sendMsgToClient(user.id, message);
}

function sendLobbyToAllClients() {

	const lobbyArray = Array.from(lobby.values());
	const message = {
		type: 'lobby',
		object: lobbyArray
	}
	sendMsgToAll(message);
}

function createLobby(user, data) {

	const newLobby = {
		userId: user.id,
		username: user.username,
		rating: "1200",
		playerColor: data.playerColor,
		timeControl: data.timeControl,
		gameMode: 'online',
	}
	lobby.set(user.id, newLobby);
	sendLobbyToAllClients();
}

function deleteLobby(id) {

	if (lobby.has(id)) {
		lobby.delete(id);
		sendLobbyToAllClients();
	}
}

function createOnlineGame(user, data) {

	const config = lobby.get(Number(data.id));
	const board = createBoard(user, config);

	chessboard.set(user.id, board);
	chessboard.set(Number(data.id), board);
	deleteLobby(Number(data.id));

	const message = {
		type: 'info',
		inGame: true,
		lastMoveFrom: board.lastMoveFrom,
		lastMoveTo: board.lastMoveTo,
    	board: board.board,
	}
	sendMsgToClient(Number(data.id), { ...message, playerColorView: board.hostColorView, });
	sendMsgToClient(user.id, { ...message, playerColorView: board.guestColorView, });
}

function createBoard(user, data) {

	let board;
	let config;
	const hostColor = (data.playerColor === "random") ? (Math.random() < 0.5 ? "white" : "black") : data.playerColor;

	if (data.gameMode === 'local') {
		config = {
			hostId: user.id,
			guestId: user.id,
			hostColor: hostColor,
			guestColorView: hostColor,
			gameMode: data.gameMode,
			timeControl: data.timeControl,
		}
	}
	else {
		config = {
			hostId: Number(data.userId),
			guestId: user.id,
			hostColor: hostColor,
			gameMode: data.gameMode,
			timeControl:data.timeControl,
		}
	}
	board = new Chessboard(config);
	return board;
}

function createLocalGame(user, data) {

	const board = createBoard(user, data);
	chessboard.set(user.id, board);

	const message = {
		type: 'info',
		inGame: true,
		playerColorView: board.hostColorView,
		lastMoveFrom: board.lastMoveFrom,
		lastMoveTo: board.lastMoveTo,
    	board: board.board,
	}
	sendMsgToClient(user.id, message);
}

function movePiece(user, data) {

	if (chessboard.has(user.id)) {
		const board = chessboard.get(user.id);
		board.handleMove(data.moveFrom, data.moveTo);
		const message = {
			type: 'move', 
			lastMoveFrom: board.lastMoveFrom,
			lastMoveTo: board.lastMoveTo,
    		board: board.board,
		}
		sendMsgToClient(board.hostId, { ...message, playerColorView: board.hostColorView, });
		sendMsgToClient(board.guestId, { ...message, playerColorView: board.guestColorView, });
	}
}

export function handleIncomingSocketMessage(user, socket) {

	socket.on('message', async message => {
		try {
			const data = JSON.parse(message.toString());
			if (data.type === 'info')
				sendInfoToClient(user, data);
			if (data.type === 'lobby')
				sendLobbyToAllClients();
			if (data.type === 'config') {
				if (data.gameMode === 'online') {
					createLobby(user, data);
				}
				else {
					deleteLobby(user.id);
					createLocalGame(user, data);
				}
			}
			if (data.type === 'join') {
				createOnlineGame(user, data);
			}
			if (data.type === 'cancel') {
				deleteLobby(user.id);
			}
			if (data.type === 'move') {
				movePiece(user, data);
			}
		} catch (error) {
			console.log("An error occured:", error);
		}
	})
}

export function handleSocketClose(user, socket) {

	socket.on('close', () => {
		deleteLobby(user.id);
		clients.delete(user.id);
		chessboard.delete(user.id);
	});
}

export function handleSocketError(user, socket) {

	socket.on('error', (error) => {
		console.log(`WebSocket error :`, error);
	});
}

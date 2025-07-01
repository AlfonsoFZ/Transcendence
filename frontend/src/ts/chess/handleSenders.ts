import { Chessboard } from "./chessboardClass.js";

export function sendPieceMove(socket: WebSocket, userId: string, fromSquare: string, toSquare: string, piece: string, chessboard: Chessboard) {

	const message = {
		type: 'move',
		userId: userId,
		piece: piece,
		moveFrom: fromSquare,
		moveTo: toSquare,
		board: chessboard.board
	};
	socket.send(JSON.stringify(message));
}

export function sendGameStart(socket: WebSocket, data: string) {

	const message = {
		type: 'start',
		data: data,
	};
	socket.send(JSON.stringify(message));
}

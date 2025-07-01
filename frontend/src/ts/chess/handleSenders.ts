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

export function sendGameConfig(socket: WebSocket, data: any) {

	const message = {
		type: 'config',
		userId: data.userId,
		playerColor: data.playerColor,
		timeControl: data.timeControl,
		gameMode: data.gameMode,
		minRating: data.minRating,
		maxRating: data.maxRating,
	};
	socket.send(JSON.stringify(message));
}

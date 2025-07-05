import { userId, socket, chessboard } from './state.js';
export function requestLobbyList() {
    const message = {
        type: 'lobby',
    };
    socket.send(JSON.stringify(message));
}
export function sendPieceMove(fromSquare, toSquare, piece) {
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
export function sendGameConfig(data) {
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
export function sendOptionSelected(id) {
    let message;
    if (userId === id) {
        message = {
            type: 'cancel'
        };
    }
    else {
        message = {
            type: 'join',
            id: id,
        };
    }
    socket.send(JSON.stringify(message));
}

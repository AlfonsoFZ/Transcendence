export function sendPieceMove(socket, userId, fromSquare, toSquare, piece, chessboard) {
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
export function sendGameConfig(socket, data) {
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

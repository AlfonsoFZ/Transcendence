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
export function sendGameStart(socket, data) {
    const message = {
        type: 'start',
        data: data,
    };
    socket.send(JSON.stringify(message));
}

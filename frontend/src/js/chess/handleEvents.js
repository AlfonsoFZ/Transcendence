import { setupChessboard, drawMovingPiece, highlightSquare } from './drawChessboard.js';
let lastMoveFrom = null;
let lastMoveTo = null;
let selectedSquares = new Set();
function getSquare(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const squareSize = canvas.width / 8;
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);
    if (col < 0 || col > 7 || row < 0 || row > 7) {
        return null;
    }
    // console.log(`Square is: ${String.fromCharCode(97 + col)}${8 - row}`);
    return `${row}${col}`;
}
function movePiece(event, fromSquare, piece, copy, canvas) {
    const currentSquare = getSquare(event, canvas);
    copy.deletePiece(fromSquare);
    setupChessboard(copy, canvas, fromSquare, null, selectedSquares);
    if (currentSquare) {
        highlightSquare(currentSquare, canvas);
    }
    drawMovingPiece(event, piece, canvas);
}
function dropPiece(event, fromSquare, piece, chessboard, canvas) {
    // If move is ok from backend, then
    // fromSquare and toSquare are always set here. But it should set it only if they are valids.
    // If fromSquare === toSquare, response is false from backend
    const response = true;
    const toSquare = getSquare(event, canvas);
    if (toSquare && response) {
        lastMoveFrom = fromSquare;
        lastMoveTo = toSquare;
        chessboard.movePiece(lastMoveFrom, lastMoveTo);
        setupChessboard(chessboard, canvas, lastMoveFrom, lastMoveTo, selectedSquares);
    }
    else {
        setupChessboard(chessboard, canvas, lastMoveFrom, lastMoveTo, selectedSquares);
    }
}
function activateMouseListeners(fromSquare, piece, chessboard, canvas) {
    function mouseMoveHandler(event) {
        movePiece(event, fromSquare, piece, chessboard.clone(), canvas);
    }
    function mouseUpHandler(event) {
        dropPiece(event, fromSquare, piece, chessboard, canvas);
        window.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("mouseup", mouseUpHandler);
    }
    function mouseRightClickHandler(event) {
        setupChessboard(chessboard, canvas, lastMoveFrom, lastMoveTo, selectedSquares);
        window.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("mouseup", mouseUpHandler);
        window.removeEventListener("contextmenu", mouseRightClickHandler);
    }
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("contextmenu", mouseRightClickHandler);
}
export function handleEvents(chessboard, canvas) {
    // To prevent right click context menu
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
    // Event listener to change style cursor
    canvas.addEventListener("mousemove", (event) => {
        const square = getSquare(event, canvas);
        if (square) {
            const piece = chessboard.getPieceAt(square);
            if (piece) {
                canvas.style.cursor = "pointer";
            }
            else {
                canvas.style.cursor = "default";
            }
        }
    });
    // Event listener to handle select and move a piece or select and highlight a square
    canvas.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
            if (selectedSquares) {
                selectedSquares.clear();
                setupChessboard(chessboard, canvas, lastMoveFrom, lastMoveTo, selectedSquares);
            }
            const fromSquare = getSquare(event, canvas);
            if (fromSquare) {
                const piece = chessboard.getPieceAt(fromSquare);
                if (piece) {
                    movePiece(event, fromSquare, piece, chessboard.clone(), canvas);
                    activateMouseListeners(fromSquare, piece, chessboard, canvas);
                }
            }
        }
        if (event.button === 2) {
            const square = getSquare(event, canvas);
            if (square) {
                if (selectedSquares.has(square)) {
                    selectedSquares.delete(square);
                }
                else {
                    selectedSquares.add(square);
                }
                setupChessboard(chessboard, canvas, lastMoveFrom, lastMoveTo, selectedSquares);
            }
        }
    });
    // Event listener for resize window
    window.addEventListener("resize", () => {
        requestAnimationFrame(() => {
            setupChessboard(chessboard, canvas, lastMoveFrom, lastMoveTo, selectedSquares);
        });
    });
}

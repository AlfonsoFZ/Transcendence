import { Pawn, Knight, Bishop, Rook, Queen, King, ChessPiece } from './chessPieceClass.js'

export class Chessboard {

	constructor(data) {

		this.hostId = data.hostId;
		this.guestId = data.guestId;
		this.hostColor = data.hostColor;
		this.guestColor = this.getGuestColor();
		this.hostColorView = data.hostColorView || this.hostColor;
		this.guestColorView = data.guestColorView || this.guestColor;
		this.gameMode = data.gameMode;
		this.timeControl = data.timeControl;
		this.move = data.move || 0;
		this.turn = this.getTurn();
		this.lastMoveFrom = data.lastMoveFrom || null;
		this.lastMoveTo = data.lastMoveTo || null;
		if (data.game) {
			this.game = new Map(
				data.game.map(([key, value]) => [
					Number(key),
					value.map(row => row.slice()),
				])
			);
		}
		else
			this.game = new Map();
		if (data.board)
			this.board = data.board.map(row => row.slice());
		else {
			this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
			this.initBoard();
		}
	}

	initBoard() {

		this.board[0][0] = new Rook('black', '00');
		this.board[0][1] = new Knight('black', '01');
		this.board[0][2] = new Bishop('black', '02');
		this.board[0][3] = new Queen('black', '03');
		this.board[0][4] = new King('black', '04');
		this.board[0][5] = new Bishop('black', '05');
		this.board[0][6] = new Knight('black', '06');
		this.board[0][7] = new Rook('black', '07');
		this.board[1][0] = new Pawn('black', '10');
		this.board[1][1] = new Pawn('black', '11');
		this.board[1][2] = new Pawn('black', '12');
		this.board[1][3] = new Pawn('black', '13');
		this.board[1][4] = new Pawn('black', '14');
		this.board[1][5] = new Pawn('black', '15');
		this.board[1][6] = new Pawn('black', '16');
		this.board[1][7] = new Pawn('black', '17');
		this.board[7][0] = new Rook('white', '70');
		this.board[7][1] = new Knight('white', '71');
		this.board[7][2] = new Bishop('white', '72');
		this.board[7][3] = new Queen('white', '73');
		this.board[7][4] = new King('white', '74');
		this.board[7][5] = new Bishop('white', '75');
		this.board[7][6] = new Knight('white', '76');
		this.board[7][7] = new Rook('white', '77');
		this.board[6][0] = new Pawn('white', '60');
		this.board[6][1] = new Pawn('white', '61');
		this.board[6][2] = new Pawn('white', '62');
		this.board[6][3] = new Pawn('white', '63');
		this.board[6][4] = new Pawn('white', '64');
		this.board[6][5] = new Pawn('white', '65');
		this.board[6][6] = new Pawn('white', '66');
		this.board[6][7] = new Pawn('white', '67');
		this.game.set(this.move++, this.board);
	}

	getGuestColor() {
		return (this.hostColor !== 'white') ? 'white' : 'black';
	}

	getTurn() {
		return (this.move % 2 !== 0) ? 'white' : 'black';
	}

	setPieceAt(square, piece) {

		const row = Math.floor(square / 10);
		const col = square % 10;
		this.board[row][col] = piece;
		piece.set(square)
	}

	deletePieceAt(square) {

		const row = Math.floor(square / 10);
		const col = square % 10;
		this.board[row][col] = null;
	}

	setLastMoves(fromSquare, toSquare) {

		this.lastMoveFrom = fromSquare;
		this.lastMoveTo = toSquare;
	}

	getPieceAt(square) {

		const row = Math.floor(square / 10);
		const col = square % 10;
		return this.board[row][col];
	}

	findKing(color, board) {

		const notation = (color === 'white' ? 'wk' : 'bk');

		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				const piece = board[row][col];
				if (piece && piece.getNotation() === notation)
					return piece;
			}
		}
		return null;
	}

	isCheck(fromSquare, toSquare, color) {

		const steps = Math.abs(toSquare - fromSquare);
		const isKingRow = Math.floor(fromSquare / 10);
		const isKingCol = fromSquare % 10;;
		const isKing = this.board[isKingRow][isKingCol];

		if (isKing.getNotation()[1] === 'k' && isKing.castle === true && steps === 2)
			if (this.isCheck(fromSquare, fromSquare, color) || this.isCheck(fromSquare, fromSquare < toSquare ? fromSquare + 1 : fromSquare - 1, color))
				return true;

		const copy = this.clone();
		const board = copy.board;
		copy.movePiece(fromSquare, toSquare);
		const kingPiece = copy.findKing(color, board);
		const square = kingPiece.getSquare();

		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				const piece = board[row][col];
				if (piece && piece.getColor() !== color) {
					if (piece.isLegalMove(piece.getSquare(), square, copy.board, copy.lastMoveFrom, copy.lastMoveTo)) 
						return true;
				}
			}
		}
		return false;
	}

	isCheckMate(fromSquare, toSquare, color) {

		if (this.isCheck(fromSquare, toSquare, color === 'white' ? 'black' : 'white')) {
			console.log("ennemy is in check")

		}
		return false;
	}

	handleMove(fSquare, tSquare, id) {

		const fromSquare = Number(fSquare);
		const toSquare = Number(tSquare);
		const piece = this.getPieceAt(fromSquare);
		const color = this.getTurn();

		if (color !== piece.color)
			return;
		if (this.gameMode === 'online' && ((id === this.hostId ? this.hostColor : this.guestColor) !== color))
			return;
		if (!piece.isLegalMove(fromSquare, toSquare, this.board, this.lastMoveFrom, this.lastMoveTo))
			return;
		// isPromotion();
		if (this.isCheck(fromSquare, toSquare, color))
			return;
		if (this.isCheckMate(fromSquare, toSquare, color))
			console.log("")
		// if (this.isStaleMate(fromSquare, toSquare))
		// 	console.log("ennemy is in stalemate")
		this.movePiece(fromSquare, toSquare);
	}

	movePiece(fromSquare, toSquare) {

		const piece = this.getPieceAt(fromSquare);
		this.deletePieceAt(fromSquare);
		this.deletePieceAt(toSquare);
		this.setPieceAt(toSquare, piece);
		this.lastMoveFrom = fromSquare;
		this.lastMoveTo = toSquare;
		this.game.set(this.move, this.board);
		this.move++;
		this.turn = this.move % 2 === 0;
	}

	getBoard() {

		return this.board.map(row =>
			row.map(piece => piece ? piece.getNotation() : null)
		);
	}

	getData() {

		const data = {
			hostId: this.hostId,
			guestId: this.guestId,
			hostColor: this.hostColor,
			guestColor: this.guestColor,
			hostColorView: this.hostColorView,
			guestColorView: this.guestColorView,
			gameMode: this.gameMode,
			timeControl: this.timeControl,
			move: this.move,
			turn: this.turn,
			lastMoveFrom: this.lastMoveFrom,
			lastMoveTo: this.lastMoveTo,
			game: Array.from(this.game.entries()),
			board: this.board.map(row => row.map(piece => piece ? piece.clone() : null)),
		}
		return data;
	}

	clone() {

		const data = this.getData();
		const newBoard = new Chessboard(data);
		return newBoard;
	}
}


// Primero, comprobar si la pieza que se intenta mover es del color que corresponde el turno
// Segundo, comprobar si es un movimiento legal
// Tercero, comprobar si no se está en jaque después del movimiento legal
// Cuarto, comprobar si se hace jaque al contrario (si se hace jaque, comprobar si se hace jaque mate)

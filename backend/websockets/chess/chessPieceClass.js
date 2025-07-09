
export class ChessPiece {

	constructor(color, square) {
		this.color = color;
		this.square = square;
	}

	set(square) {
		this.square = square
	}
	getColor() {
		return this.color;
	}
	getNotation(){}
	isLegalMove(fromSquare, toSquare, board, lastMoveTo) {}
}

export class Pawn extends ChessPiece {

	getNotation() {
		return this.color[0] + 'p';
	}
	isLegalMove(fromSquare, toSquare, board, lastMoveTo) {

		return true
	}
}

export class Knight extends ChessPiece {

	getNotation() {
		return this.color[0] + 'n';
	}
	isLegalMove(fromSquare, toSquare, board, lastMoveTo) {

		return true		
	}
}

export class Bishop extends ChessPiece {

	getNotation() {
		return this.color[0] + 'b';
	}
	isLegalMove(fromSquare, toSquare, board, lastMoveTo) {

		return true
	}
}

export class Rook extends ChessPiece {

	getNotation() {
		return this.color[0] + 'r';
	}
	isLegalMove(fromSquare, toSquare, board, lastMoveTo) {

		if (fromSquare === toSquare)
			return false;

		const frow = Math.floor(fromSquare / 10);
		const fcol = fromSquare % 10;
		const trow = Math.floor(toSquare / 10);
		const tcol = toSquare % 10;

		if (board[trow][tcol]!== null && board[trow][tcol][0] === this.getColor()[0])
			return false;
		if (frow === trow) {
			for (let i = tcol - fcol; i !== 0; tcol > fcol ? i-- : i++)
				if ((tcol - i) !== tcol && (tcol - i) !== fcol && board[trow][tcol - i] !== null)
					return false;
			return true;
		}
		else if (fcol === tcol) {
			for (let i = trow - frow; i !== 0; trow > frow ? i-- : i++)
				if ((trow - i) !== trow && (trow - i) !== frow && board[trow - i][tcol] !== null)
					return false;
			return true;
		}
		return false;
	}
}

export class Queen extends ChessPiece {

	getNotation() {
		return this.color[0] + 'q';
	}
	isLegalMove(fromSquare, toSquare, board, lastMoveTo) {

		return true		
	}
}

export class King extends ChessPiece {

	castle = true;

	getNotation() {
		return this.color[0] + 'k';
	}
	isLegalMove(fromSquare, toSquare, board, lastMoveTo) {

		return true		
	}	
}

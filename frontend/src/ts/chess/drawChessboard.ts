
export function createCanvas(board: HTMLDivElement): HTMLCanvasElement {

	const canvas = document.createElement("canvas");
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	canvas.style.display = "block";
	board.insertBefore(canvas, board.firstChild);
	return canvas;
}

function resizeCanvas(canvas: HTMLCanvasElement) {

	const rect = canvas.getBoundingClientRect();
	const size = Math.floor(rect.width / 8) * 8;
	canvas.width = size;
	canvas.height = size;
}

function drawBoard(canvas: HTMLCanvasElement) {

	const squareSize = canvas.width / 8;
	const ctx = canvas.getContext("2d")!;

	for (let row = 0; row < 8; row++) {
		for (let col = 0; col < 8; col++) {
			const isLight = (row + col) % 2 === 0;
			ctx.fillStyle = isLight ? "#f8fafc" : "#4380b7";
			ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
		}
	}
}

export function setupChessboard(canvas: HTMLCanvasElement) {

	resizeCanvas(canvas);
	drawBoard(canvas);
}

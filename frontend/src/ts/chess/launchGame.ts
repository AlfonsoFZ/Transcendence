import { handleEvents } from './handleEvents.js'
import { Chessboard } from './chessboardClass.js'
import { sendGameStart } from './handleSenders.js'
import { handleSocketEvents } from '../chess/handleSocketEvents.js'
import { createCanvas, preloadImages, setupChessboard } from './drawChessboard.js'
import { getLaunchGameHtml, getChessHtml } from './handleFetchers.js'


export function checkIfGameIsRunning() {

	return sessionStorage.getItem("chessboard") || "";
}

function initChessboard(): string {
	
	const playerColor = (document.getElementById('color') as HTMLSelectElement).value;
	const timeControl = (document.getElementById('time') as HTMLSelectElement).value;
	const gameMode = (document.getElementById('mode') as HTMLSelectElement).value;
	const minRating = (document.getElementById('minRating') as HTMLSelectElement).value;
	const maxRating = (document.getElementById('maxRating') as HTMLSelectElement).value;

	let dataPlayerColor, dataTimeControl, dataGameMode, dataMinRating, dataMaxRating;
	if (playerColor === 'random') {
		const options = ['white', 'black'];
		const randomIndex = Math.floor(Math.random() * options.length);
		dataPlayerColor = options[randomIndex];
	}
	else {
		dataPlayerColor = playerColor;
	}
	dataTimeControl = timeControl;
	dataGameMode = gameMode;
	dataMinRating = (minRating === "any") ? -10000 : parseInt(minRating, 10);
	dataMaxRating = (maxRating === "any") ? 10000 : parseInt(maxRating, 10);

	const data = {
		playerColor: dataPlayerColor,
		timeControl: dataTimeControl,
		gameMode: dataGameMode,
		minRating: dataMinRating,
		maxRating: dataMaxRating,
	}
	return JSON.stringify(data);
}

export async function launchUI(socket: WebSocket, userId: string, appElement: HTMLElement) {

	appElement.innerHTML = await getLaunchGameHtml();
	const start = document.getElementById('start-game') as HTMLButtonElement;
	const modeContainer = document.getElementById('modeContainer') as HTMLDivElement;
	const modeSelect = document.getElementById('mode') as HTMLSelectElement;

	function toggleModeVisibility(modeContainer: HTMLDivElement, modeSelect: HTMLSelectElement) {
		if (modeSelect.value === 'online')
			modeContainer.classList.remove('hidden');
		else
			modeContainer.classList.add('hidden');
	}
	modeSelect.addEventListener('change', () => toggleModeVisibility(modeContainer, modeSelect));
	start.addEventListener('click', async () =>{
		const data = initChessboard();
		sendGameStart(socket, data);
		await launchGame(socket, userId, data, appElement)
	});
}

export async function launchGame(socket: WebSocket, userId: string, data: string, appElement: HTMLElement) {

		const chessboard = new Chessboard(data);

		appElement.innerHTML = await getChessHtml();
		const board = document.getElementById("board") as HTMLDivElement;

		const canvas = createCanvas(board);
		preloadImages(()=>{
			setupChessboard(chessboard, canvas, null, null);
			handleEvents(socket!, userId, chessboard, canvas);
			handleSocketEvents(socket!, userId, chessboard, canvas);
		});
}

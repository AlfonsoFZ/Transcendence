import { handleEvents } from './handleEvents.js'
import { getConfigHtml, getChessHtml } from './handleFetchers.js'
import { preloadImages, setupChessboard } from './drawChessboard.js'
import { requestLobbyList, sendGameConfig } from './handleSenders.js'
import { userId, appContainer, chessboard, setChessboard, setCanvas } from './state.js'

export function checkIfGameIsRunning(): any {

	const data = sessionStorage.getItem("chessboard") || "";
	if (data)
		return JSON.parse(data);
	return null;
}

function getConfig(): any {

	const playerColor = (document.getElementById('color') as HTMLSelectElement).value;
	const timeControl = (document.getElementById('time') as HTMLSelectElement).value;
	const gameMode = (document.getElementById('mode') as HTMLSelectElement).value;
	const minRating = (document.getElementById('minRating') as HTMLSelectElement).value;
	const maxRating = (document.getElementById('maxRating') as HTMLSelectElement).value;

	let dataPlayerColor, dataTimeControl, dataGameMode, dataMinRating, dataMaxRating;
	dataPlayerColor = playerColor;
	dataTimeControl = timeControl;
	dataGameMode = gameMode;
	dataMinRating = (minRating === "any") ? -10000 : parseInt(minRating, 10);
	dataMaxRating = (maxRating === "any") ? 10000 : parseInt(maxRating, 10);

	const data = {
		userId: userId,
		playerColor: dataPlayerColor,
		timeControl: dataTimeControl,
		gameMode: dataGameMode,
		minRating: dataMinRating,
		maxRating: dataMaxRating,
	}
	return data;
}

async function launchConfig() {

	appContainer!.innerHTML = await getConfigHtml();
	const start = document.getElementById('start-game') as HTMLButtonElement;
	const modeContainer = document.getElementById('modeContainer') as HTMLDivElement;
	const modeSelect = document.getElementById('mode') as HTMLSelectElement;
	const minRating = document.getElementById('minRating') as HTMLSelectElement;
	const maxRating = document.getElementById('maxRating') as HTMLSelectElement;

	function blockRatingBracket() {

		if (modeSelect.value === "local") {
			minRating.value = 'any';
			maxRating.value = 'any';
			minRating.disabled = true;
			maxRating.disabled = true;
		}
		else {
			minRating.disabled = false;
			maxRating.disabled = false;
		}
	}
	blockRatingBracket();
	requestLobbyList();
	modeSelect.addEventListener('change', () => blockRatingBracket());
	start.addEventListener('click', async () => {
		const data = getConfig();
		sendGameConfig(data);

		await launchGame(data)
	});

}

async function launchLobby() {

}

export async function launchUI() {

	await launchConfig();
	await launchLobby();
}

// Creo que data es un string y por eso no funciona. Hay que parsearlo a JSON
export async function launchGame(data: any) {

	appContainer!.innerHTML = await getChessHtml();
	setCanvas();
	setChessboard(data);

	preloadImages(() => {
		setupChessboard(chessboard!, null, null);
		handleEvents();
	});
}

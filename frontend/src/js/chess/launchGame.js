var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { handleEvents } from './handleEvents.js';
import { Chessboard } from './chessboardClass.js';
import { sendGameConfig } from './handleSenders.js';
import { handleSocketEvents } from '../chess/handleSocketEvents.js';
import { createCanvas, preloadImages, setupChessboard } from './drawChessboard.js';
import { getLaunchGameHtml, getChessHtml } from './handleFetchers.js';
export function checkIfGameIsRunning() {
    return sessionStorage.getItem("chessboard") || "";
}
function getConfig(userId) {
    const playerColor = document.getElementById('color').value;
    const timeControl = document.getElementById('time').value;
    const gameMode = document.getElementById('mode').value;
    const minRating = document.getElementById('minRating').value;
    const maxRating = document.getElementById('maxRating').value;
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
    };
    return data;
}
export function launchUI(socket, userId, appElement) {
    return __awaiter(this, void 0, void 0, function* () {
        appElement.innerHTML = yield getLaunchGameHtml();
        const start = document.getElementById('start-game');
        const modeContainer = document.getElementById('modeContainer');
        const modeSelect = document.getElementById('mode');
        function toggleModeVisibility(modeContainer, modeSelect) {
            if (modeSelect.value === 'online')
                modeContainer.classList.remove('hidden');
            else
                modeContainer.classList.add('hidden');
        }
        modeSelect.addEventListener('change', () => toggleModeVisibility(modeContainer, modeSelect));
        start.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const data = getConfig(userId);
            sendGameConfig(socket, data);
            // await launchGame(socket, userId, data, appElement)
        }));
    });
}
export function launchGame(socket, userId, data, appElement) {
    return __awaiter(this, void 0, void 0, function* () {
        const chessboard = new Chessboard(data);
        appElement.innerHTML = yield getChessHtml();
        const board = document.getElementById("board");
        const canvas = createCanvas(board);
        preloadImages(() => {
            setupChessboard(chessboard, canvas, null, null);
            handleEvents(socket, userId, chessboard, canvas);
            handleSocketEvents(socket, userId, chessboard, canvas);
        });
    });
}
// Launch UI === LaunchConfig + LaunchLobby
// Global: userId, socket, chessboard, canvas

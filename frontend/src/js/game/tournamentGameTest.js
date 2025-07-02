var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Some functions that could be useful if imported:
// import {checkPlayer, parsePlayerInfo} from '../game/GameConnection.js' - not sure if working fine without sockets
// import { setPlayerInfo, setGuestInfo } from '../game/Game.js'; - not usables, but could adapt to work outside the object instance
import Game from '../game/Game.js';
import { Step } from "../spa/stepRender.js";
// Default container ID (I think it must match HTML file)
const DEFAULT_CONTAINER_ID = "tournament-container";
export default class Tournament extends Step {
    constructor(containerId = DEFAULT_CONTAINER_ID) {
        super(DEFAULT_CONTAINER_ID);
        this.currentMatchIndex = 0;
        this.bracket = [];
        this.config = null;
        this.players = null;
    }
    render(appElement) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("../../html/game/tournamentUI.html");
                if (!response.ok)
                    throw new Error("Failed to load the game UI HTML file");
                const htmlContent = yield response.text();
                appElement.innerHTML = htmlContent;
            }
            catch (error) {
                console.error("Error loading game UI:", error);
                appElement.innerHTML = `<div class="error-container">Failed to load game interface. Please try again.</div>`;
            }
            this.generateTestBracket(4);
            const launchBtn = document.getElementById('launch-match-btn');
            if (launchBtn) {
                launchBtn.addEventListener('click', () => this.launchNextMatch());
            }
            this.displayCurrentMatch();
            // setupListeners() method for forms, submit, buttons...
        });
    }
    displayCurrentMatch() {
        var _a, _b;
        const panel = document.getElementById('current-match-panel');
        if (!panel || !this.bracket)
            return;
        const match = this.bracket[this.currentMatchIndex];
        if (!match) {
            panel.innerHTML = "<p>No more matches.</p>";
            return;
        }
        panel.innerHTML = `
			<h3>Current Match</h3>
			<p>${(_a = match.playerDetails.player1) === null || _a === void 0 ? void 0 : _a.username} vs ${(_b = match.playerDetails.player2) === null || _b === void 0 ? void 0 : _b.username}</p>
			<p>Match ID: ${match.id}</p>
		`;
    }
    // Matchmaking first (or random) and then fill each game.log (metadata) of the array
    generateTestBracket(count) {
        if (!this.bracket)
            this.bracket = [];
        for (let i = 0; i < count; i++) {
            const matchData = {
                id: `test-match-${i + 1}`,
                mode: '1v1',
                playerDetails: {
                    player1: {
                        id: `player-${i * 2 + 1}`,
                        username: `Player${i * 2 + 1}`,
                        tournamentUsername: `Player${i * 2 + 1}`,
                        email: `player${i * 2 + 1}@test.com`,
                        avatarPath: '/images/default-avatar.png'
                    },
                    player2: {
                        id: `player-${i * 2 + 2}`,
                        username: `Player${i * 2 + 2}`,
                        tournamentUsername: `Player${i * 2 + 2}`,
                        email: `player${i * 2 + 2}@test.com`,
                        avatarPath: '/images/default-avatar.png'
                    }
                },
                startTime: Date.now(),
                config: {
                    scoreLimit: 5,
                    difficulty: 'medium'
                },
                result: {
                    winner: '',
                    loser: '',
                    score: [0, 0]
                },
                duration: 0,
                tournamentId: 1,
                readyState: true
            };
            this.bracket.push(matchData);
        }
    }
    // Create new Game instance, set the needed params (i think log will be enough)
    //		and start the usual workflow client-server to start the match in its own step
    launchNextMatch() {
        let matchData;
        if (this.bracket && this.currentMatchIndex < this.bracket.length) {
            matchData = this.bracket[this.currentMatchIndex];
            const game = new Game(matchData.id);
            game.setGameLog(matchData);
            game.getGameUI().launchGame();
            this.currentMatchIndex++;
            this.displayCurrentMatch();
        }
        // Navigate to game-match step, passing game instance
    }
    // Receive and gather game results - may need to improve gameMatch class to pass this info
    // Also, may need to call it or implement it on a wait/promise manner?
    handleMatchResult(result) {
        // Aux method -> Update bracket, increment currentMatchIndex, etc.
    }
}

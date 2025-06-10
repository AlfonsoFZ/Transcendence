/**
 * GameUI.ts -> UI setup and event listeners
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class TournamentUI {
    constructor(tournament) {
        this.tournament = tournament;
    }
    showOnly(divId, displayStyle = "block") {
        const divIndex = [
            'select-tournament',
            'tournament-config-panel',
            'tournament-container',
            'tournament-results',
            'local-tournament-form'
        ];
        divIndex.forEach(id => {
            const checkDiv = document.getElementById(id);
            if (checkDiv)
                checkDiv.style.display = (id === divId) ? displayStyle : "none";
        });
    }
    initializeUI(appElement) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("../../html/tournament/tournamentUI.html");
                if (!response.ok)
                    throw new Error("Failed to load the tournament UI HTML file");
                const htmlContent = yield response.text();
                appElement.innerHTML = htmlContent;
            }
            catch (error) {
                console.error("Error loading game UI:", error);
                appElement.innerHTML = `<div class="error-container">Failed to load tournament interface. Please try again.</div>`;
            }
            this.setupEventListeners();
        });
    }
    // Sets up event listeners for game mode buttons, which after will also set controllers
    setupEventListeners() {
        var _a, _b, _c;
        console.log("Setting up tournament UI event listeners");
        // Game mode buttons
        (_a = document.getElementById('localTournament')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            // await this.game.setPlayerInfo('player1', null);
            // this.game.setGameMode('1v1');
            this.showOnly('local-tournament-form');
            // this.setupPlayer2LoginPanel();
        }));
        (_b = document.getElementById('remoteTournament')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            // await this.game.setPlayerInfo('player1', null);
            // this.game.setGuestInfo('player2', 'ai');
            // this.game.setGameMode('1vAI');
            this.showOnly('tournament-config-panel');
        }));
        (_c = document.getElementById('searchTournament')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            // Lobby + diff player entry assignation
            // await this.game.setPlayerInfo('player1', null);
            // this.game.setGameMode('remote');
            this.showOnly('tournament-config-panel');
        }));
    }
}

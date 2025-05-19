var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Step } from "./stepRender.js";
export default class Game extends Step {
    constructor() {
        super(...arguments);
        this.socket = null;
        this.currentState = null;
        this.connectionStat = false;
    }
    render(appElement) {
        return __awaiter(this, void 0, void 0, function* () {
            appElement.innerHTML = `
			<div class="game-container">
				<!-- Paddles -->
				<div id="left-paddle" class="paddle"></div>
				<div id="right-paddle" class="paddle"></div>
				
				<!-- Ball -->
				<div id="ball" class="ball"></div>
				
				<!-- Score -->
				<div id="score" class="score">0 - 0</div>
				
				<!-- Controls -->
				<div class="controls">
					<button id="play-ai" disabled>Play vs AI</button>
					<button id="play-online" disabled>Play Online</button>
				</div>
			</div>
		`;
            yield this.establishConnection();
            this.setupEventListeners();
        });
    }
    /**
     * As a first approach, let's establish and registrer the websocket connection as soon
     * as the #test root is reached, this means create a new WebSocket, then
     */
    establishConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // 1. Socket create/registred - ping test - buttons appear
                this.socket = new WebSocket(`https://${window.location.host}/back/ws/game`);
                // 1.1 Set what we want to happen on open socket (at first connected)
                this.socket.onopen = () => {
                    var _a, _b, _c;
                    console.log('Connected to game server');
                    // Send ping to test connection
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                        type: 'PING',
                        timestamp: Date.now()
                    }));
                    this.connectionStat = true;
                    (_b = document.getElementById('play-ai')) === null || _b === void 0 ? void 0 : _b.removeAttribute('disabled');
                    (_c = document.getElementById('play-online')) === null || _c === void 0 ? void 0 : _c.removeAttribute('disabled');
                    resolve();
                };
                // 2. Setting message received handler for all desired cases
                this.socket.onmessage = (event) => {
                    var _a;
                    console.log("Message received from server:", event.data);
                    try {
                        const data = JSON.parse(event.data);
                        console.log("Parsed server message:", data);
                        switch (data.type) {
                            case 'GAME_STATE':
                                this.renderGameState(data.state);
                                break;
                            case 'SERVER_TEST':
                                console.log("Server test message:", data.message);
                                // Respond to confirm bidirectional communication
                                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                                    type: 'PING',
                                    message: 'Client response to server test'
                                }));
                                break;
                            case 'PONG':
                                console.log("Server responded to ping");
                                break;
                            default:
                                console.log(`Received message with type: ${data.type}`);
                        }
                    }
                    catch (error) {
                        console.error("Error parsing server message:", error);
                    }
                };
                // 3. Error handler
                this.socket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    reject(error); // Reject the promise on error
                };
                // 4. Connection closed handler: set bool flag to false and hide play buttons
                this.socket.onclose = (event) => {
                    var _a, _b;
                    console.log(`WebSocket connection closed: Code ${event.code}${event.reason ? ' - ' + event.reason : ''}`);
                    this.connectionStat = false;
                    (_a = document.getElementById('play-ai')) === null || _a === void 0 ? void 0 : _a.setAttribute('disabled', 'disabled');
                    (_b = document.getElementById('play-online')) === null || _b === void 0 ? void 0 : _b.setAttribute('disabled', 'disabled');
                };
            });
        });
    }
    setupEventListeners() {
        var _a, _b;
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (!this.socket)
                return;
            const input = {
                up: e.key === 'ArrowUp',
                down: e.key === 'ArrowDown'
            };
            this.socket.send(JSON.stringify({
                type: 'PLAYER_INPUT',
                input
            }));
        });
        // Game mode buttons
        (_a = document.getElementById('play-ai')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            this.joinGame('1vAI');
        });
        (_b = document.getElementById('play-online')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            this.joinGame('1v1');
        });
    }
    joinGame(mode) {
        if (!this.socket || !this.connectionStat) {
            console.error("Cannot join game: connection not ready");
            return;
        }
        console.log(`Requesting to join ${mode} game...`);
        this.socket.send(JSON.stringify({
            type: 'JOIN_GAME',
            mode: mode
        }));
    }
    renderGameState(state) {
        // Update paddles
        const leftPaddle = document.getElementById('left-paddle');
        const rightPaddle = document.getElementById('right-paddle');
        if (leftPaddle)
            leftPaddle.style.top = `${state.paddles.player1.y * 100}%`;
        if (rightPaddle)
            rightPaddle.style.top = `${state.paddles.player2.y * 100}%`;
        // Update ball
        const ball = document.getElementById('ball');
        if (ball) {
            ball.style.left = `${state.ball.x * 100}%`;
            ball.style.top = `${state.ball.y * 100}%`;
        }
        // Update score
        const score = document.getElementById('score');
        if (score)
            score.textContent = `${state.scores[0]} - ${state.scores[1]}`;
    }
    destroy() {
        if (this.socket)
            this.socket.close();
    }
}

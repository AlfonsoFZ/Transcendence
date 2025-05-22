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
        this.connectionStat = false;
        this.canvas = null;
        this.ctx = null;
        this.gameState = null;
        this.animationFrameId = null;
    }
    render(appElement) {
        return __awaiter(this, void 0, void 0, function* () {
            appElement.innerHTML = `
			<!-- Game setup - config -->
			<div class="select-game" id="select-game" style="display: block;">
				<h1 class="text-center text-white mb-4 text-4xl font-bold font-[Tektur]">Select Game Mode</h1>
				<div class="flex flex-col gap-4 items-center">
					<button id="play-ai" style="width: 200px" class="h-12 py-3 bg-blue-500 text-white border-none rounded hover:bg-blue-600 font-bold cursor-pointer text-base flex justify-center items-center">Play vs AI</button>
					<button id="play-online" style="width: 200px" class="h-12 py-3 bg-green-500 text-white border-none rounded hover:bg-green-600 font-bold cursor-pointer text-base flex justify-center items-center">Play Online</button>
				</div>
			</div>
			<div class="game-container" id="game-container" style="display: none;">
				<canvas id="game-canvas" width="800" height="600" style="background-color: black;"></canvas>
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
                    var _a;
                    console.log('Connected to game server');
                    // Send ping to test connection
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                        type: 'PING',
                        timestamp: Date.now()
                    }));
                    this.connectionStat = true;
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
                    console.log(`WebSocket connection closed: Code ${event.code}${event.reason ? ' - ' + event.reason : ''}`);
                    this.connectionStat = false;
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
        const selectGame = document.getElementById('select-game');
        const gameDiv = document.getElementById('game-container');
        if (selectGame)
            selectGame.style.display = "none";
        if (gameDiv)
            gameDiv.style.display = "block";
        this.canvas = document.getElementById('game-canvas');
        if (this.canvas)
            this.ctx = this.canvas.getContext('2d');
    }
    renderGameState(state) {
        this.gameState = state;
        if (!this.canvas) {
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            if (!this.canvas || !this.ctx)
                return;
            // Start the animation loop if this is the first state update
            this.startRenderLoop();
        }
    }
    startRenderLoop() {
        // Cancel any existing animation frame
        if (this.animationFrameId !== null)
            cancelAnimationFrame(this.animationFrameId);
        const renderLoop = () => {
            this.drawGame();
            this.animationFrameId = requestAnimationFrame(renderLoop);
        };
        this.animationFrameId = requestAnimationFrame(renderLoop);
    }
    drawGame() {
        if (!this.ctx || !this.canvas || !this.gameState)
            return;
        // Clear the canvas
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCenterLine();
        this.drawPaddles();
        this.drawBall();
        this.drawScore();
    }
    drawCenterLine() {
        if (!this.ctx || !this.canvas)
            return;
        const centerX = this.canvas.width / 2;
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    drawPaddles() {
        if (!this.ctx || !this.canvas || !this.gameState)
            return;
        this.ctx.fillStyle = "white";
        const leftPaddleY = this.gameState.paddles.player1.y * this.canvas.height;
        this.ctx.fillRect(30, leftPaddleY, 20, 100); // Assuming paddle width of 20 and height of 100
        const rightPaddleY = this.gameState.paddles.player2.y * this.canvas.height;
        this.ctx.fillRect(this.canvas.width - 50, rightPaddleY, 20, 100);
    }
    drawBall() {
        if (!this.ctx || !this.canvas || !this.gameState)
            return;
        const ballX = this.gameState.ball.x * this.canvas.width;
        const ballY = this.gameState.ball.y * this.canvas.height;
        this.ctx.beginPath();
        this.ctx.arc(ballX, ballY, 10, 0, Math.PI * 2); // Ball with radius 10
        this.ctx.fillStyle = "white";
        this.ctx.fill();
    }
    drawScore() {
        if (!this.ctx || !this.canvas || !this.gameState)
            return;
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px Tektur, sans-serif";
        this.ctx.textAlign = "center";
        const scoreText = `${this.gameState.scores[0]} - ${this.gameState.scores[1]}`;
        this.ctx.fillText(scoreText, this.canvas.width / 2, 50);
    }
    destroy() {
        if (this.socket)
            this.socket.close();
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

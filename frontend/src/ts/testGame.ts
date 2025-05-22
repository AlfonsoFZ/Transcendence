import { Step } from "./stepRender.js";

export default class Game extends Step
{
	private socket: WebSocket | null = null;
	private connectionStat: boolean = false;

	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private gameState: any = null;
	private animationFrameId: number | null = null;

	async render(appElement: HTMLElement): Promise<void> {
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
		await this.establishConnection();
		this.setupEventListeners();
	}

	/**
	 * As a first approach, let's establish and registrer the websocket connection as soon
	 * as the #test root is reached, this means create a new WebSocket, then 
	 */
	private async	establishConnection() : Promise<void>
	{
		return new Promise((resolve, reject) => {
			// 1. Socket create/registred - ping test - buttons appear
			this.socket = new WebSocket(`https://${window.location.host}/back/ws/game`);
			// 1.1 Set what we want to happen on open socket (at first connected)
			this.socket.onopen = () => {
				console.log('Connected to game server');
				// Send ping to test connection
				this.socket?.send(JSON.stringify({
					type: 'PING',
					timestamp: Date.now()
				}));
				this.connectionStat = true;
				resolve();
			};
		
			// 2. Setting message received handler for all desired cases
			this.socket.onmessage = (event) => {
				console.log("Message received from server:", event.data);
				try
				{
					const data = JSON.parse(event.data);
					console.log("Parsed server message:", data);
					switch(data.type)
					{
						case 'GAME_STATE':
							this.renderGameState(data.state);
							break ;
						case 'SERVER_TEST':
							console.log("Server test message:", data.message);
							// Respond to confirm bidirectional communication
							this.socket?.send(JSON.stringify({
								type: 'PING',
								message: 'Client response to server test'
							}));
							break ;
						case 'PONG':
							console.log("Server responded to ping");
							break ;
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
		})
	}

	private setupEventListeners()
	{
		// Keyboard input
		document.addEventListener('keydown', (e) => {
			if (!this.socket) return;
			
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
		document.getElementById('play-ai')?.addEventListener('click', () => {
			this.joinGame('1vAI');
		});
		
		document.getElementById('play-online')?.addEventListener('click', () => {
			this.joinGame('1v1');
		});
	}

	private joinGame(mode: string)
	{
		if (!this.socket || !this.connectionStat)
		{
			console.error("Cannot join game: connection not ready");
			return;
		}
		console.log(`Requesting to join ${mode} game...`);
		this.socket.send(JSON.stringify({
			type: 'JOIN_GAME',
			mode: mode
		}));
		const	selectGame = document.getElementById('select-game');
		const	gameDiv = document.getElementById('game-container');
		if (selectGame)
			selectGame.style.display = "none";
		if (gameDiv)
			gameDiv.style.display = "block";
		this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
		if (this.canvas)
			this.ctx = this.canvas.getContext('2d');
	}

	private renderGameState(state: any)
	{
		this.gameState = state;
		if (!this.canvas)
		{
			this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
			this.ctx = this.canvas.getContext('2d');
			if (!this.canvas || !this.ctx)
				return;
			// Start the animation loop if this is the first state update
			this.startRenderLoop();
		}
	}

	private startRenderLoop() 
	{
		// Cancel any existing animation frame
		if (this.animationFrameId !== null)
			cancelAnimationFrame(this.animationFrameId);
		const renderLoop = () => {
			this.drawGame();
			this.animationFrameId = requestAnimationFrame(renderLoop);
		};
		this.animationFrameId = requestAnimationFrame(renderLoop);
	}

	private drawGame()
	{
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

	private drawCenterLine()
	{
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

	private drawPaddles()
	{
		if (!this.ctx || !this.canvas || !this.gameState)
			return;
		this.ctx.fillStyle = "white";
		const leftPaddleY = this.gameState.paddles.player1.y * this.canvas.height;
		this.ctx.fillRect(30, leftPaddleY, 20, 100); // Assuming paddle width of 20 and height of 100
		const rightPaddleY = this.gameState.paddles.player2.y * this.canvas.height;
		this.ctx.fillRect(this.canvas.width - 50, rightPaddleY, 20, 100);
	}

	private drawBall()
	{
		if (!this.ctx || !this.canvas || !this.gameState)
			return;
		
		const ballX = this.gameState.ball.x * this.canvas.width;
		const ballY = this.gameState.ball.y * this.canvas.height;
		this.ctx.beginPath();
		this.ctx.arc(ballX, ballY, 10, 0, Math.PI * 2); // Ball with radius 10
		this.ctx.fillStyle = "white";
		this.ctx.fill();
	}

	private drawScore()
	{
		if (!this.ctx || !this.canvas || !this.gameState)
			return;
	
		this.ctx.fillStyle = "white";
		this.ctx.font = "40px Tektur, sans-serif";
		this.ctx.textAlign = "center";
		
		const scoreText = `${this.gameState.scores[0]} - ${this.gameState.scores[1]}`;
		this.ctx.fillText(scoreText, this.canvas.width / 2, 50);
	}

	public destroy()
	{
		if (this.socket)
			this.socket.close();
		if (this.animationFrameId !== null)
		{
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}
}

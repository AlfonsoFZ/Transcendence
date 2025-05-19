import { Step } from "./stepRender.js";

export default class Game extends Step
{
	private socket: WebSocket | null = null;
	private currentState: any = null;
	private connectionStat: boolean = false;

	async render(appElement: HTMLElement): Promise<void> {
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
				document.getElementById('play-ai')?.removeAttribute('disabled');
				document.getElementById('play-online')?.removeAttribute('disabled');
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
				document.getElementById('play-ai')?.setAttribute('disabled', 'disabled');
				document.getElementById('play-online')?.setAttribute('disabled', 'disabled');
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
	}

	private renderGameState(state: any)
	{
		// Update paddles
		const leftPaddle = document.getElementById('left-paddle');
		const rightPaddle = document.getElementById('right-paddle');
		
		if (leftPaddle) leftPaddle.style.top = `${state.paddles.player1.y * 100}%`;
		if (rightPaddle) rightPaddle.style.top = `${state.paddles.player2.y * 100}%`;

		// Update ball
		const ball = document.getElementById('ball');
		if (ball) {
			ball.style.left = `${state.ball.x * 100}%`;
			ball.style.top = `${state.ball.y * 100}%`;
		}

		// Update score
		const score = document.getElementById('score');
		if (score) score.textContent = `${state.scores[0]} - ${state.scores[1]}`;
	}

	public destroy()
	{
		if (this.socket)
			this.socket.close();
	}
}

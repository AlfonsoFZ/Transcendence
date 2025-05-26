/**
 * GameUI.ts -> UI setup and event listeners
 */

export class GameUI
{
	private	game: any;
	private	keydownListener: ((e: KeyboardEvent) => void) | null = null;

	constructor(game: any)
	{
		this.game = game;
	}

	async initializeUI(appElement: HTMLElement): Promise<void> {
		appElement.innerHTML = `
			<!-- Game setup - config -->
			<div class="select-game" id="select-game" style="display: block;">
				<h1 class="text-center text-white mb-4 text-4xl font-bold font-[Tektur]">Select Game Mode</h1>
				<div class="flex flex-col gap-4 items-center">
					<button id="play-1v1" style="width: 200px" class="h-12 py-3 bg-green-600 text-white border-none rounded hover:bg-green-500 font-bold cursor-pointer text-base flex justify-center items-center">Play 1v1</button>
					<button id="play-ai" style="width: 200px" class="h-12 py-3 bg-blue-500 text-white border-none rounded hover:bg-blue-600 font-bold cursor-pointer text-base flex justify-center items-center">Play vs AI</button>
					<button id="play-online" style="width: 200px" class="h-12 py-3 bg-green-500 text-white border-none rounded hover:bg-green-600 font-bold cursor-pointer text-base flex justify-center items-center">Play Online</button>
					<button id="play-ai" style="width: 200px" class="h-12 py-3 bg-blue-600 text-white border-none rounded hover:bg-blue-400 font-bold cursor-pointer text-base flex justify-center items-center">Tournament!</button>
				</div>
			</div>
			<div class="game-container" id="game-container" style="display: none; width: 100%; max-width: 1200px; margin: 0 auto; text-align: center;">
				<canvas id="game-canvas" width="800" height="600" style="background-color: black; margin: 0 auto; display: block; max-width: 100%; height: auto;"></canvas>
			</div>
		`;
	}

	// Sets up event listeners for game mode buttons, which after will also set controllers event listeners
	setupEventListeners()
	{
		// Game mode buttons
		document.getElementById('play-ai')?.addEventListener('click', () => {
			this.joinGame('1vAI');
		});
		document.getElementById('play-1v1')?.addEventListener('click', () => {
			this.joinGame('1v1');
		});
		document.getElementById('play-online')?.addEventListener('click', () => {
			this.joinGame('remote');
		});
		// Add tournament button listener if finally implemented here
	}

	// Sets up event listeners for controllers, depending on game mode
	setupControllers(mode : string)
	{
		// Clear previous keydown listener if exists
		if (this.keydownListener)
			document.removeEventListener('keydown', this.keydownListener);
		this.keydownListener = (e: KeyboardEvent) => {
			if (!this.game.connection.socket)
				return;
			let input = null;
			// W/S keys for player 1, who is always present and using the left paddle
			if (e.key.toLowerCase() === 'w' || e.key.toLowerCase() === 's')
			{
				input = {
					player: 2,
					up: e.key.toLowerCase() === 'w',
					down: e.key.toLowerCase() === 's'
				};
			}
			// Player 2 controls
			if (mode === '1v1' && (e.key === 'ArrowUp' || e.key === 'ArrowDown'))
			{
				input = {
					player: 2,
					up: e.key === 'ArrowUp',
					down: e.key === 'ArrowDown'
				};
			}
	
			if (input)
			{
				this.game.connection.socket.send(JSON.stringify({
					type: 'PLAYER_INPUT',
					input
				}));
			}
		};
		document.addEventListener('keydown', this.keydownListener);
	}

	joinGame(mode: string)
	{
		if (!this.game.connection.socket || !this.game.connection.connectionStat)
		{
			console.error("Cannot join game: connection not ready");
			return;
		}
		this.game.mode = mode;
		console.log(`Requesting to join ${mode} game...`);
		this.game.connection.socket.send(JSON.stringify({
			type: 'JOIN_GAME',
			mode: mode
		}));
		const	selectGame = document.getElementById('select-game');
		const	gameDiv = document.getElementById('game-container');
		if (selectGame)
			selectGame.style.display = "none";
		if (gameDiv)
			gameDiv.style.display = "block";
		this.game.renderer.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
		if (this.game.renderer.canvas)
			this.game.renderer.ctx = this.game.renderer.canvas.getContext('2d');
	}
}

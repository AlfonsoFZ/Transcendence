/**
 * GameControllers.ts -> Handles all input and controller logic for the game
 * This is an auxiliar component to keep GameUI shorter and better readable
 */

import Game from './Game.js'

export class GameControllers
{
	private game: Game;
	private keyState = { w: false, s: false, ArrowUp: false, ArrowDown: false };
	private keydownListener: ((e: KeyboardEvent) => void);
	private keyupListener: ((e: KeyboardEvent) => void);
	private inputInterval: number | null = null;
	private listenersActive = false;

	constructor(game: Game)
	{
		this.game = game;
		this.keydownListener = this.handleKeyDown.bind(this);
		this.keyupListener = this.handleKeyUp.bind(this);
	}

	private handleKeyDown(e: KeyboardEvent)
	{
        const key = e.key.toLowerCase();
        let keyChanged = false;
        if (key === 'w' && !this.keyState.w) { this.keyState.w = true; keyChanged = true; }
        else if (key === 's' && !this.keyState.s) { this.keyState.s = true; keyChanged = true; }
        else if (key === 'arrowup' && !this.keyState.ArrowUp) { this.keyState.ArrowUp = true; keyChanged = true; }
        else if (key === 'arrowdown' && !this.keyState.ArrowDown) { this.keyState.ArrowDown = true; keyChanged = true; }
        if (keyChanged && (this.keyState.w || this.keyState.s || this.keyState.ArrowUp || this.keyState.ArrowDown))
            this.startSendingInputs();
    }

    private handleKeyUp(e: KeyboardEvent)
	{
        const key = e.key.toLowerCase();
        if (key === 'w') this.keyState.w = false;
        else if (key === 's') this.keyState.s = false;
        else if (key === 'arrowup') this.keyState.ArrowUp = false;
        else if (key === 'arrowdown') this.keyState.ArrowDown = false;
        if (!this.keyState.w && !this.keyState.s && !this.keyState.ArrowUp && !this.keyState.ArrowDown)
            this.stopSendingInputs();
    }

	private	startSendingInputs()
	{
		// Only start if we haven't already
		if (this.inputInterval)
			return;
		// Send inputs (60fps)
		this.inputInterval = window.setInterval(() => {
			if (!this.game.getGameConnection().socket)
				return ;
			// Always send player1 input
			if (this.game.getGameIsHost())
			{
				this.game.getGameConnection().socket?.send(JSON.stringify({
					type: 'PLAYER_INPUT',
					input: {
						player: 'player1',
						up: this.keyState.w,
						down: this.keyState.s
					}
				}));
			}
			// Send player2 input if 1v1 mode
			if (this.game.getGameLog().mode === '1v1'
				|| (this.game.getGameLog().mode === 'remote' && !this.game.getGameIsHost()))
			{
				this.game.getGameConnection().socket?.send(JSON.stringify({
					type: 'PLAYER_INPUT',
					input: {
						player: 'player2',
						up: this.keyState.ArrowUp,
						down:this. keyState.ArrowDown
					}
				}));
			}
		}, 16);
	};

	private stopSendingInputs()
	{
		if (this.inputInterval)
		{
			window.clearInterval(this.inputInterval);
			this.inputInterval = null;
		}
	};

	/**
	 * Set up keyboard controllers for different game modes
	 * @param mode Game mode ('1vAI', '1v1', 'remote')
	 * @returns Cleanup function
	 */
	setupControllers()
	{
		this.cleanup();
		if(!this.listenersActive)
		{
			document.addEventListener('keydown', this.keydownListener);
			document.addEventListener('keyup', this.keyupListener);
			this.listenersActive = true;
		}
	}

	/**
	 * Aux method to clean all controller listeners and resources such as intervals
	 */
	public cleanup()
	{
		window.clearInterval(this.inputInterval!);
		if (this.listenersActive)
		{
			document.removeEventListener('keydown', this.keydownListener);
			document.removeEventListener('keyup', this.keyupListener);
			this.listenersActive = false;
		}
	}

	public destroy()
	{
		this.cleanup();
		this.game = null as any;
	}
}

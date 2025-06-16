import Game from './Game.js';

export class GameAI 
{
	private		game: Game;
	private		intervalId: number | null = null;

	constructor(game: Game)
	{
		this.game = game;
	}

	start()
	{
		this.intervalId = window.setInterval(() => this.update(), 16);
	}

	stop()
	{
		if (this.intervalId)
		{
			window.clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	private update()
	{
		const gameState = this.game.getGameRender().gameState;
		if (!gameState || !this.game.getGameConnection().socket)
			return;

		const ballY = gameState.ball?.y ?? 0.5;
		const paddleY = gameState.paddles.player2?.y ?? 0.5;
		const tolerance = 0.02;

		let up = false, down = false;
		if (ballY < paddleY - tolerance)
			up = true;
		else if (ballY > paddleY + tolerance)
			down = true;

		this.game.getGameConnection().socket?.send(JSON.stringify({
			type: 'PLAYER_INPUT',
			input: {
				player: 'player2',
				up,
				down
			}
		}));
	}
}

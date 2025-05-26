/**
 * gameState.js file:
 * 	- Game state elements managment related functions
 * TODO: Could set GameState as a class or interface to export/import?
 */

// Initialize or reset game elements positions
export function resetState()
{
	return {
		ball: { x: 0.5, y: 0.5, dx: 0.20, dy: 0.06 },
		paddles: {
			player1: { y: 0.5 },
			player2: { y: 0.5 }
		},
		scores: [0, 0]
	};
}

// Update game state struct -> elements values/positions + score
export function update(deltaTime)
{
	// Ball movement with appropriate clamping
	this.state.ball.x += this.state.ball.dx * deltaTime;
	this.state.ball.y += this.state.ball.dy * deltaTime;

	// Wall collisions (top/bottom) + small buffer (0.01) to prevent ball getting stuck
	if (this.state.ball.y <= 0.01)
	{
		this.state.ball.y = 0.01;
		this.state.ball.dy = Math.abs(this.state.ball.dy);
	} 
	else if (this.state.ball.y >= 0.99)
	{
		this.state.ball.y = 0.99;
		this.state.ball.dy = -Math.abs(this.state.ball.dy);
	}
	this.checkPaddleCollision('player1');
	this.checkPaddleCollision('player2');
	this.checkScoring();
}

// Check if ball has scored on one side and update players scores if so
export function checkScoring()
{
	// Skip scoring check if already in reset phase
	if (this.isResetting)
		return;

	const ball = this.state.ball;
	// Player 1 scores (ball passes right edge)
	if (ball.x >= 1)
	{
		this.state.scores[0]++;
		this.isResetting = true;
		// Freeze the ball
		this.state.ball.dx = 0;
		this.state.ball.dy = 0;
		// Reset after delay
		setTimeout(() => {
			this.resetBall('right');
			this.isResetting = false;
		}, 1000);
	}
	// Player 2 scores (ball passes left edge)
	else if (ball.x <= 0)
	{
		this.state.scores[1]++;
		this.isResetting = true;
		// Freeze the ball
		this.state.ball.dx = 0;
		this.state.ball.dy = 0;
		// Reset after delay
		setTimeout(() => {
			this.resetBall('left');
			this.isResetting = false;
		}, 1000);
	}
}

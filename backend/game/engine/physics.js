/**
 * physics.js file: movement, collisions and related functions
 */

// Function for restoring the ball in the middle and towards scored-against player
export function resetBall(scoringDirection)
{
	const	centerX = 0.5; 
	const	centerY = 0.5;
	const	speed = 0.20;
	const	angleVariance = (Math.random() * 0.1) - 0.05;
	let		direction;

	if (scoringDirection === undefined)
		direction = Math.random() > 0.5 ? 1 : -1;
	else
		direction = scoringDirection === 'right' ? 1 : -1;
	
	this.state.ball = { 
		x: centerX, 
		y: centerY, 
		dx: speed * direction, 
		dy: 0.05 + angleVariance 
	};	
}

// Main function to check for paddle-ball collisions
// TODO: Reduce function size by getting some calculations out by using auxiliary functions
export function checkPaddleCollision(playerNumber)
{
	// Get paddle and ball position from the game state
	const paddle = this.state.paddles[playerNumber];
	const ball = this.state.ball;
	// Set paddle and ball dimensions relative to screen size, using relative % units
	const paddleWidth = 0.025;
	const paddleHeight = 0.15;
	const ballRadius = 0.015;

	// Calculate paddel velocity (direction and speed), by storing last position before comparing to actual one
	if (!paddle.lastY)
		paddle.lastY = paddle.y;
	const paddleVelocity = paddle.y - paddle.lastY;
	paddle.lastY = paddle.y;
	
	// Calculate paddle position and dimensions (edges), again with relative units to screen size
	const paddleX = playerNumber === 'player1' ? 0.03 : (0.97 - paddleWidth);
	const paddleTop = paddle.y - (paddleHeight / 2);
	const paddleBottom = paddle.y + (paddleHeight / 2);
	const collisionEdgeX = playerNumber === 'player1' ? paddleX + paddleWidth : paddleX;
	
	// Checks if the ball is within paddle's vertical range, this ends in a boolean true/false
	const ballInYRange = (ball.y >= paddleTop) && (ball.y <= paddleBottom);
	// Check if the ball is at the collision edge, using a boolean as well
	let ballAtCollisionX = false;
	if (playerNumber === 'player1')
		ballAtCollisionX = ((ball.x - ballRadius) <= collisionEdgeX) && (ball.x >= paddleX);
	else
		ballAtCollisionX = ((ball.x + ballRadius) >= collisionEdgeX) && (ball.x <= (paddleX + paddleWidth));
	
	// If both bolean variables are true, then check for collision
	if (ballAtCollisionX && ballInYRange)
	{
		// Position adjustment to prevent penetration - adding a small offset
		if (playerNumber === 'player1')
			this.state.ball.x = collisionEdgeX + ballRadius + 0.001;
		else
			this.state.ball.x = collisionEdgeX - ballRadius - 0.001;
		// Calculate current ball speed
		const currentSpeed = Math.sqrt(
			this.state.ball.dx * this.state.ball.dx + 
			this.state.ball.dy * this.state.ball.dy
		);
		
		// Increase speed by 7% (more noticeable than 5%)
		const speedMultiplier = 1.07;
		
		// ATARI-STYLE BOUNCE PHYSICS:
		// 1. Calculate relative position on paddle (from -1 at top to +1 at bottom)
		const hitPosition = (ball.y - paddle.y) / (paddleHeight/2);
		
		// 2. Base angle change - more dramatic at edges
		// This creates a more pronounced angle when hitting near the edges
		let angleEffect = hitPosition * 0.3; // Stronger effect than before (was 0.12)
		
		// 3. Add paddle movement effect - if paddle is moving, it influences the ball direction
		// This is what gives that classic Atari pong feel
		const paddleMovementEffect = paddleVelocity * 3.0; // Amplify paddle movement effect
		angleEffect += paddleMovementEffect;
		
		// 4. Reverse horizontal direction with speed increase  
		this.state.ball.dx *= -speedMultiplier;
		
		// 5. Apply the combined angle effect
		this.state.ball.dy += angleEffect;
		
		// 6. Edge cases - hitting extreme top/bottom of paddle creates extreme angles
		// This makes edge hits more dramatic and skillful
		if (Math.abs(hitPosition) > 0.8) { // Near the edge (top 20% or bottom 20%)
			// Amplify the angle even more for edge hits
			this.state.ball.dy += (hitPosition > 0 ? 0.1 : -0.1);
		}
		
		// 7. Cap maximum speed to prevent the game from becoming unplayable
		const maxSpeed = 0.6; // Adjust this value as needed
		const newSpeed = Math.sqrt(
			this.state.ball.dx * this.state.ball.dx + 
			this.state.ball.dy * this.state.ball.dy
		);
		
		if (newSpeed > maxSpeed) {
			// Scale back to maximum speed
			const scaleFactor = maxSpeed / newSpeed;
			this.state.ball.dx *= scaleFactor;
			this.state.ball.dy *= scaleFactor;
		}	
	}
}

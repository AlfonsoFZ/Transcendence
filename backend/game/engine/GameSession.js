/**
 * GameSession.js file:
 * 	- GameSession class initial declaration (constructor)
 * 	- Aux/utils methods (getters/setters, debug) and core methods that don't fit elsewhere
 */
export class GameSession
{
	constructor(roomId, gameMode)
	{
		this.roomId = roomId;
		this.gameMode = gameMode;
		this.players = new Map();
		this.state = this.resetState();
		// TODO: check if resetBall is working properly here
		this.resetBall();
		this.gameLoop = null;
		this.aiInterval = null;
		this.lastUpdateTime = Date.now();
		this.isResetting = false;
	}

	// Add a player to the game
	addPlayer(playerId, connection)
	{
		if (this.players.size >= 2)
			throw new Error('Game is full');
		const playerNumber = this.players.size === 0 ? 'player1' : 'player2';
		this.players.set(playerId, { connection, playerNumber });
		// Start AI if needed
		if (this.gameMode === '1vAI' && this.players.size === 1)
			this.startAI();
		return (playerNumber);
	}

	// Get game configuration
	getConfig()
	{
		return {
			roomId: this.roomId,
			gameMode: this.gameMode,
			playerCount: this.players.size
		};
	}

	// Check if game should start
	shouldStart() {
		if (this.gameMode === '1vAI') {
			return this.players.size === 1;
		}
		return this.players.size === 2;
	}

	// Handle player input
	handleInput(playerId, input) {
		const playerData = this.players.get(playerId);
		if (!playerData) return;
	
		const paddle = this.state.paddles[playerData.playerNumber];
		const speed = 0.020; // Slightly slower for better control
		const paddleHeight = 0.15;
		
		// Calculate the exact boundaries
		const minY = paddleHeight / 2;
		const maxY = 1 - (paddleHeight / 2);
		
		// Move paddle with boundary enforcement
		if (input.up) {
			paddle.y = Math.max(minY, paddle.y - speed);
		}
		if (input.down) {
			paddle.y = Math.min(maxY, paddle.y + speed);
		}
		
		// Double-check boundaries to ensure paddle is fully contained
		if (paddle.y < minY) paddle.y = minY;
		if (paddle.y > maxY) paddle.y = maxY;
	}

	// Get all active connections
	getConnections() {
		const connections = new Map();
		this.players.forEach((data, playerId) => {
			connections.set(playerId, data.connection);
		});
		return connections;
	}

	getPlayerState(playerId) {
		const playerData = this.players.get(playerId);
		return {
			...this.state,
			playerNumber: playerData?.playerNumber
		};
	}

	// Remove a player from the game
	removePlayer(playerId) {
		this.players.delete(playerId);
		
		// Stop game if empty
		if (this.isEmpty()) {
			this.destroy();
		}
	}

	// Check if game has no players
	isEmpty() {
		return this.players.size === 0;
	}

	// Start AI opponent
	startAI() {
		this.aiInterval = setInterval(() => {
			const ballY = this.state.ball.y;
			const paddle = this.state.paddles.player2;
			
			// Store last position to track movement
			if (!paddle.lastY) {
				paddle.lastY = paddle.y;
			}
			
			// Old position
			const oldY = paddle.y;
			
			// Increase tracking speed from 0.1 to 0.13 (30% faster)
			paddle.y += (ballY - paddle.y) * 0.13;
			
			// Respect boundaries for AI paddle too
			const paddleHeight = 0.15;
			const minY = paddleHeight / 2;
			const maxY = 1 - (paddleHeight / 2);
			
			if (paddle.y < minY) paddle.y = minY;
			if (paddle.y > maxY) paddle.y = maxY;
			
			// Track velocity
			paddle.lastY = oldY;
		}, 50);
	}

	// Start the game loop
	startGameLoop()
	{
		this.gameLoop = setInterval(() => {
			const now = Date.now();
			const deltaTime = 16 / 1000; // Fixed delta for stable physics
			this.update(deltaTime);
			this.broadcastState();
		}, 16);
	}

	// Send game state to all players
	broadcastState()
	{
		const connections = this.getConnections();
		connections.forEach((connection, playerId) => {
			if (connection.readyState === 1) { // 1 = OPEN
				connection.send(JSON.stringify({
					type: 'GAME_STATE',
					state: this.getPlayerView(playerId),
					timestamp: Date.now()
				}));
			}
		});
	}

	// Get state for a specific player
	getPlayerView(playerId) {
		const playerData = this.players.get(playerId);
		if (!playerData) return null;

		return {
			...this.state,
			playerNumber: playerData.playerNumber
		};
	}

	// Clean up resources
	destroy() {
		clearInterval(this.gameLoop);
		clearInterval(this.aiInterval);
	}
}

// TODO: Address the gameSessions map approach
export function startGameLoop(gameSession)
{
	let lastUpdateTime = Date.now();
	const gameLoop = setInterval(() => {
		// 1. Check if game still exists
		// if (!gameSessions.has(gameSession.roomId))
		// {
		// 	clearInterval(gameLoop);
		// 	return ;
		// }
		// 2. Calculate time since last update
		const now = Date.now();
		const deltaTime = (now - lastUpdateTime) / 1000; // Convert to seconds
		lastUpdateTime = now;
		// 3. Update game state (ball position, scores, etc.)
		gameSession.update(deltaTime);
		// 4. Send updated state to all players in game
		gameSession.getConnections().forEach((connection, playerId) => {
			if (connection.readyState === 1) // OPEN
			{ 
				connection.send(JSON.stringify({
					type: 'GAME_STATE',
					state: gameSession.getPlayerState(playerId),
					timestamp: now
				}));
			}
		});
	}, 16); // ~60fps (1000ms/60 ≈ 16ms)
}

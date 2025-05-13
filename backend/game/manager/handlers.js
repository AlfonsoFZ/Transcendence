// FILE TO IMPLEMENT CLIENT-SERVER(WS) COMMUNICATION HANDLERS //

/**
 * JOIN_GAME	Player wants to join/create a game	{ roomId: "abc123", gameMode: "1v1" }
 * PLAYER_INPUT	Player moves paddle	{ input: { up: true, down: false } }
 * LEAVE_GAME	Player quits	(no additional data)
 */
export function	handleGameMessage(client, connection)
{
	connection.socket.on('message', (message) => {
		try
		{
			const data = JSON.parse(message.toString());
			if (data.type === 'JOIN_GAME')
				handleJoinGame(client, data);
			else if (data.type === 'PLAYER_INPUT')
				handlePlayerInput(client, data);
			else if (data.type === 'LEAVE_GAME')
				handleLeaveGame(client);
		}
		catch (error){
			console.error('Game message error:', error);
		}
	});
}

/**
 * When a player JOINs the game
 * TODO: implement GameSession class/interface
 * TODO: implement shouldStart()
 */
function handleJoinGame(client, data)
{
	const { user, connection } = client;
	const { roomId, gameMode } = data;
	// 1. Find or create the game session
	let gameSession = gameSessions.get(roomId);
	if (!gameSession)
	{
		gameSession = new GameSession(roomId, gameMode);
		gameSessions.set(roomId, gameSession);
	}
	// 2. Add player to the game
	const playerNumber = gameSession.addPlayer(user.id, connection);
	// 3. Update tracking
	clients.set(user.id, { connection, roomId });
	// 4. Send initial game data
	connection.socket.send(JSON.stringify({
		type: 'GAME_INIT',
		playerNumber, // "player1" or "player2" - "playerLeft" or "playerRight"
		config: gameSession.getConfig()
	}));
	// 5. Start game if ready (e.g., 2 players connected + online mode, 1 player connected + 1vAI mode...)
	if (gameSession.shouldStart()) {
		startGameLoop(gameSession);
	}
}

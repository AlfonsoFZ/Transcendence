// Some functions that could be useful if imported:
// import {checkPlayer, parsePlayerInfo} from '../game/GameConnection.js' - not sure if working fine without sockets
// import { setPlayerInfo, setGuestInfo } from '../game/Game.js'; - not usables, but could adapt to work outside the object instance
import Game from '../game/Game.js';
import { Step } from "../spa/stepRender.js";
import { GamePlayer, GameConfig, GameData } from '../game/types.js';

// Default container ID (I think it must match HTML file)
const DEFAULT_CONTAINER_ID = "tournament-container";

export default class Tournament extends Step
{
	config: GameConfig | null; // This is set with the first div panel/form
	// First div panel will also set array size for players and bracket
	players: GamePlayer[] | null; // Each object of the array gets filled with assign-player form
	bracket: GameData[] | undefined; // Match making function will fill array with each match log-info
	currentMatchIndex: number = 0;

	constructor(containerId: string = DEFAULT_CONTAINER_ID)
	{
		super(DEFAULT_CONTAINER_ID);
		this.bracket = [];
		this.config = null;
		this.players = null;
	}

	async render(appElement: HTMLElement): Promise<void>
	{
		try
		{
			const response = await fetch("../../html/game/tournamentUI.html");
			if (!response.ok)
				throw new Error("Failed to load the game UI HTML file");
			const htmlContent = await response.text();
			appElement.innerHTML = htmlContent;
		}
		catch (error)
		{
			console.error("Error loading game UI:", error);
			appElement.innerHTML = `<div class="error-container">Failed to load game interface. Please try again.</div>`;
		}
		this.generateTestBracket(4);
		const launchBtn = document.getElementById('launch-match-btn');
		if (launchBtn) {
			launchBtn.addEventListener('click', () => this.launchNextMatch());
		}
		this.displayCurrentMatch();
		// setupListeners() method for forms, submit, buttons...
	}

	displayCurrentMatch()
	{
		const panel = document.getElementById('current-match-panel');
		if (!panel || !this.bracket) return;
		const match = this.bracket[this.currentMatchIndex];
		if (!match) {
			panel.innerHTML = "<p>No more matches.</p>";
			return;
		}
		panel.innerHTML = `
			<h3>Current Match</h3>
			<p>${match.playerDetails.player1?.username} vs ${match.playerDetails.player2?.username}</p>
			<p>Match ID: ${match.id}</p>
		`;
	}

	// Matchmaking first (or random) and then fill each game.log (metadata) of the array
	generateTestBracket(count : number)
	{
		if (!this.bracket)
			this.bracket = [];
		for (let i = 0; i < count; i++)
		{
			const matchData: GameData = {
				id: `test-match-${i + 1}`,
				mode: '1v1',
				playerDetails: {
					player1: {
						id: `player-${i * 2 + 1}`,
						username: `Player${i * 2 + 1}`,
						tournamentUsername: `Player${i * 2 + 1}`,
						email: `player${i * 2 + 1}@test.com`,
						avatarPath: '/images/default-avatar.png'
					},
					player2: {
						id: `player-${i * 2 + 2}`,
						username: `Player${i * 2 + 2}`,
						tournamentUsername: `Player${i * 2 + 2}`,
						email: `player${i * 2 + 2}@test.com`,
						avatarPath: '/images/default-avatar.png'
					}
				},
				startTime: Date.now(),
				config: {
					scoreLimit: 5,
					difficulty: 'medium'
				},
				result: {
					winner: '',
					loser: '',
					score: [0, 0]
				},
				duration: 0,
				tournamentId: 1,
				readyState: true
			};
			this.bracket.push(matchData);
		}
	}

	// Create new Game instance, set the needed params (i think log will be enough)
	//		and start the usual workflow client-server to start the match in its own step
	launchNextMatch()
	{
		let matchData: GameData;
		if (this.bracket && this.currentMatchIndex < this.bracket.length)
		{
			matchData = this.bracket[this.currentMatchIndex];
			const game = new Game(matchData.id);
			game.setGameLog(matchData);
			game.getGameUI().launchGame()
			this.currentMatchIndex++;
			this.displayCurrentMatch();
		}
		// Navigate to game-match step, passing game instance
	}

	// Receive and gather game results - may need to improve gameMatch class to pass this info
	// Also, may need to call it or implement it on a wait/promise manner?
	handleMatchResult(result: GameData)
	{
		// Aux method -> Update bracket, increment currentMatchIndex, etc.
	}
}
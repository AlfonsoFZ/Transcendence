/**
 * GameMatch.ts -> canvas rendering, SPA step only for the match itself
 * 	it will rsetup listeners for controllers and render the game
 * 		+ showResults / rematch - back to lobby
 */

import { SPA } from '../spa/spa.js';
import Game from './Game.js'
import { GameConnection } from './GameConnection.js';
import { GameRender } from './GameRender.js';
import { GameUI } from './GameUI.js';
import { Step } from "../spa/stepRender.js";
import { GameControllers } from './GameControllers.js'
import { GameData, GameConfig, GamePlayer } from './types.js';
import { GameAI } from './GameAI.js';
import Tournament from '../tournament/Tournament.js';

export default class GameMatch extends Step
{
	private	game: Game;
	private	tournament: Tournament | null;
	public	controllers: GameControllers;
	private log: GameData;
	private renderer: GameRender;
	private config: GameConfig;
	private	ui: GameUI;
	private	connection: GameConnection;
	private	ai: GameAI | null = null;
	private	aiSide: 'player1' | 'player2' | null = null;
	private readyStateInterval: number | null = null;
	private countdownInterval: number | null = null;

	constructor(game: Game, tournament?: Tournament | null)
	{
		super('game-container');
		this.game = game;
		this.tournament = tournament ?? null;
		this.renderer = game.getGameRender();
		this.config = game.getGameConfig();
		this.log = game.getGameLog();
		this.ui = game.getGameUI();
		this.connection = game.getGameConnection();
		if (this.log.mode === '1vAI')
		{	
			this.setAiSide(this.game.getGameLog());
			this.ai = new GameAI(this.game, this.aiSide);
		}
		this.controllers = new GameControllers(this.game, this.aiSide);
	}

	async render(appElement: HTMLElement): Promise<void>
	{
		try
		{
			const response = await fetch("../../html/game/gameMatch.html");
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

		this.updatePlayerActivity(true);
		
		const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
		if (canvas)
		{
			this.renderer.canvas = canvas;
			this.renderer.ctx = canvas.getContext('2d');
			this.renderer.drawInitialState();
		}
		this.showReadyModal();
		// TODO: eliminar comentario - Montamos los handlers de teclas pa que no nos jodan con F5 y demás mierdas durante la partida
		this.setupKeyEventHandlers();
		const	pauseModal = document.getElementById('pause-modal');
		const	pauseBtn = document.getElementById('pause-btn');
		if (pauseModal && pauseBtn)
		{
			pauseBtn.onclick = () => {
				if (this.log.mode === 'remote')
				{
					this.connection.socket?.send(JSON.stringify({
						type: 'PAUSE_GAME',
					}));
				}
				else
				{
					this.connection.socket?.send(JSON.stringify({
						type: 'PAUSE_GAME',
						reason: "A player has paused the game"
					}));
				}
			};
		}
		const	resumeBtn = document.getElementById('resume-btn');
		if (pauseModal && resumeBtn)
		{
			resumeBtn.onclick = () => {
				console.warn("resume-btn-clicked");
				//pauseModal.style.display = 'none';
				this.connection.socket?.send(JSON.stringify({ type: 'RESUME_GAME' }));
			};
		}
	}
	
	/**
	 * Display player waiting/ready status modal when game created
	 */
	public	showReadyModal() : void
	{
		const readyModal = document.getElementById('ready-modal');
		const readyBtn = document.getElementById('ready-btn') as HTMLButtonElement;
		const waitingMsg = document.getElementById('waiting-msg');
		const player1 = this.log.playerDetails.player1;
		const player2 = this.log.playerDetails.player2;
		/** search TournamentName  */
		/** to revert this change just delete everything but the code into the else */
		const players = { player1, player2 };
		if (this.tournament && this.tournament.getTournamentId() !== -42 && player1 && player2) {
		(document.getElementById('player1-name') as HTMLElement).textContent = this.showTournamentName(players, player1?.username) || "Waiting player 1...";
		(document.getElementById('player2-name') as HTMLElement).textContent = this.showTournamentName(players, player2?.username) || "Waiting player 2...";
		(document.getElementById('player1-avatar') as HTMLImageElement).src = player1?.avatarPath || "https://localhost:8443/back/images/7.png";
		(document.getElementById('player2-avatar') as HTMLImageElement).src = player2?.avatarPath || "https://localhost:8443/back/images/7.png";
		}else{
		(document.getElementById('player1-name') as HTMLElement).textContent = player1?.username || "Waiting player 1...";
		(document.getElementById('player1-avatar') as HTMLImageElement).src = player1?.avatarPath || "https://localhost:8443/back/images/7.png";
		(document.getElementById('player2-name') as HTMLElement).textContent = player2?.username || "Waiting player 2...";
		(document.getElementById('player2-avatar') as HTMLImageElement).src = player2?.avatarPath || "https://localhost:8443/back/images/7.png";
		}
		/*  end of search */
		if (readyBtn && waitingMsg)
		{
			readyBtn.onclick = () => {
				readyBtn.disabled = true;
				waitingMsg.textContent = "Waiting for opponent confirmation...";
				this.connection.socket?.send(JSON.stringify({ type: 'CLIENT_READY' }));
				if (this.ai)
					this.ai.start();
				this.controllers.setupControllers();
			};
		}

		if (this.log.mode === 'remote' && readyModal)
			this.startReadyStatePolling();
	}
	
	public showPauseModal(reason?: string, pauserId?: string): void
	{
		console.warn("pauserID", pauserId);
		const pauseModal = document.getElementById('pause-modal');
		const pauseReason = document.getElementById('pause-reason');
		const resumeBtn = document.getElementById('resume-btn') as HTMLButtonElement | null;
		if (pauseModal)
			pauseModal.style.display = 'flex';
		if (pauseReason)
			pauseReason.textContent = reason || '';
		if (this.log.mode === 'remote' && resumeBtn && pauserId)
		{
			console.warn("onlineid = ", this.game.getOnlineId());
			console.warn("pauserId = ", pauserId);
			resumeBtn.style.display = (this.game.getOnlineId() === pauserId) ? 'inline-block' : 'none';
		}
	}

	public hidePauseModal(): void
	{
		const pauseModal = document.getElementById('pause-modal');
		if (pauseModal)
			pauseModal.style.display = 'none';
	}

	/**
	 * 
	 * @param players pair of players
	 * @param username username to find
	 * @returns tournamentUsername
	 */
	public showTournamentName(players: any, username: string): string
	{
		if (this.tournament && this.tournament.getTournamentId() !== -42)
		{
			const player = [players.player1, players.player2].find(
				(p: any) => p?.username === username
			);
			if (player && player.tournamentUsername) {
				return player.tournamentUsername;
			}
		}
		return "";
	}

	/**
	 * Display game results when a game ends
	 * @param gameData Complete game data
	 */
	public showGameResults(gameData: GameData): void
	{
		// Update the HTML content with actual game data logs
		const winnerElement = document.getElementById('winner-name');
		const scoreElement = document.getElementById('final-score');
		const durationElement = document.getElementById('game-duration');
		if (winnerElement)
			winnerElement.textContent = gameData.result?.winner || 'Unknown';
		// Search for tournamentName if on tournamentMatch
		if (this.tournament && this.tournament.getTournamentId() !== -42 && winnerElement && gameData.result?.winner)
		{
			const winnerUsername = gameData.result?.winner;
			const players = gameData.playerDetails;
			const tournamentName = this.showTournamentName(players, winnerUsername);
			if (tournamentName)
				winnerElement.textContent = tournamentName;
		}
		if (scoreElement)
		{
			const score = gameData.result?.score || [0, 0];
			scoreElement.textContent = `${score[0]} - ${score[1]}`;
		}
		if (durationElement)
		{
			const duration = gameData.duration ? Math.floor(gameData.duration / 1000) : 0;
			durationElement.textContent = duration.toString();
		}
		const reasonElement = document.getElementById('end-reason');
		if (reasonElement)
			reasonElement.textContent = gameData.result?.endReason || 'Game ended';
		
		const	playAgainBtn = document.getElementById('play-again-btn');
		if (playAgainBtn && (gameData.tournamentId || gameData.mode === 'remote'))
			playAgainBtn.hidden = true;
		else if (playAgainBtn)
			playAgainBtn.hidden = false;
		// Show the results overlay
		this.ui.showOnly('game-results', 'flex');
		// Add event listeners for the buttons (these need to be set each time)
		playAgainBtn?.addEventListener('click', () => {
			this.ui.showOnly('hide-all')
			this.rematchGame(true);
		});
		document.getElementById('return-lobby-btn')?.addEventListener('click', () => {
			this.rematchGame(false);
			this.controllers.cleanup();
			this.controllers.destroy();
			this.destroy();
			const spa = SPA.getInstance();
			if(this.tournament && this.tournament.getTournamentId() !== -42)
			{
				console.log("FROM showGameResults, Handling match result for tournament:", this.tournament.getTournamentId());
				console.log("Match result data:", gameData);
				this.tournament.resumeTournament();
				this.tournament.handleMatchResult(gameData);
			}
			else
			{
				spa.currentGame = null;
				spa.navigate('game-lobby');
			}
		});
	}
	
	/**
	 * Reset the game to start a new one
	 */
	private rematchGame(state : boolean): void
	{
		if (this.connection.socket)
		{	this.connection.socket.send(JSON.stringify({
				type: 'RESTART_GAME',
				rematch: state
			}));
		}
    }

	public startReadyStatePolling()
	{
		if (this.readyStateInterval)
			return ;
		this.readyStateInterval = window.setInterval(() => {
			this.connection.socket?.send(JSON.stringify({ type: 'GET_READY_STATE' }));
		}, 1000);
	}

	public stopReadyStatePolling()
	{
		if (this.readyStateInterval)
		{
			clearInterval(this.readyStateInterval);
			this.readyStateInterval = null;
		}
	}

	public updateReadyModal(playerDetails: any, readyStates: any) : void
	{
		const player1Name = document.getElementById('player1-name') as HTMLElement;
		const player1Avatar = document.getElementById('player1-avatar') as HTMLImageElement;
		const player2Name = document.getElementById('player2-name') as HTMLElement;
		const player2Avatar = document.getElementById('player2-avatar') as HTMLImageElement;
		const player1Ready = document.getElementById('player1-ready') as HTMLElement;
		const player2Ready = document.getElementById('player2-ready') as HTMLElement;

		player1Name.textContent = playerDetails.player1?.username || "Waiting player 1...";
		player1Avatar.src = playerDetails.player1?.avatarPath || "https://localhost:8443/back/images/7.png";
		player2Name.textContent = playerDetails.player2?.username || "Waiting player 2...";
		player2Avatar.src = playerDetails.player2?.avatarPath || "https://localhost:8443/back/images/7.png";

		player1Ready.textContent = readyStates.player1 ? "Ready" : "";
		player2Ready.textContent = readyStates.player2 ? "Ready" : "";
	}

	public showCountdown(seconds: number = 3, reason?: string) : void
	{
		const overlay = document.getElementById('countdown-overlay');
		const number = document.getElementById('countdown-number');
		const reasonElem = document.getElementById('countdown-reason');
		if (!overlay || !number)
			return ;

		if (this.countdownInterval)
		{
			clearInterval(this.countdownInterval);
			this.countdownInterval = null;
		}
	
		let count = seconds;
		overlay.style.display = 'flex';
		number.textContent = count.toString();
		if (reasonElem)
			reasonElem.textContent = reason || '';

		this.countdownInterval = window.setInterval(() => {
			count--;
			if (count > 0)
				number.textContent = count.toString();
			else if (count == 0)
			{
				number.textContent = "GO!";
				clearInterval(this.countdownInterval!);
				this.countdownInterval = null;
				setTimeout(() => {
					overlay.style.display = 'none';
				}, 400);
			}
		}, 1000);
	}

	public	updatePlayerActivity(state: boolean) : void
	{
		this.connection.socket?.send(JSON.stringify({
			type: 'GAME_ACTIVITY',
			active: state
		}));
	}

	public	setAiSide(gamelog : GameData) : void
	{
		const	player1Id : number | undefined = gamelog.playerDetails.player1?.id;
		if (player1Id !== undefined && player1Id <= -1 && player1Id >= -19)
			this.aiSide = 'player1';
		else
			this.aiSide = 'player2';
	}

	public	getAiSide() : 'player1' | 'player2' | null
	{
		return (this.aiSide);
	}

	public destroy() : void
	{
		console.warn("GameMatch Destructor Called(!)");
		this.updatePlayerActivity(false);
		this.controllers.cleanup();
		this.renderer.destroy();
		// TODO: eliminar comentario - Deshabilitamos la guardia de teclas cuando se destruye el GameMatch, que no se nos quede colgao
		this.disableGameKeyGuard();
		if (this.ai)
		{
			this.ai.stop();
			this.ai = null;
		}
	
		// Not sure if needed or if can cause conflict - let's test it for a while...
		if (this.readyStateInterval)
		{
			clearInterval(this.readyStateInterval);
			this.readyStateInterval = null;
		}
		if (this.countdownInterval)
		{
			clearInterval(this.countdownInterval);
			this.countdownInterval = null;
		}
	}

	// TODO: eliminar comentario - Manejo de eventos de teclado similar al TournamentUI pero pa las partidas, que no nos jodan con F5 mientras jugamos
	private boundKeyHandler: ((event: KeyboardEvent) => void) | null = null;

	private setupKeyEventHandlers(): void {
		console.log("GameMatch: Setting up key event handlers");
		// TODO: eliminar comentario - Habilitamos la guardia de teclas pa proteger la partida
		this.enableGameKeyGuard();
	}

	private evaluateKeyEvent(event: KeyboardEvent): void {
		console.log(`GameMatch: Key event detected: "${event.key}", ctrlKey: ${event.ctrlKey}`);
		
		// TODO: eliminar comentario - Verificamos la bandera global de SPA pa bloquear eventos si hay un modal abierto
		console.log("GameMatch: Checking if modal is active...");
		if (SPA.isGlobalModalActive()) {
			console.log("GameMatch: Event blocked - Modal is currently active");
			return;
		}
		console.log("GameMatch: No modal active, processing key event");
		
		// TODO: eliminar comentario - Prevenimos Alt+F4 y Ctrl+F5 pa evitar salidas accidentales/recargas durante la partida
		if (event.ctrlKey && (event.key === "F5" || event.key === "r")) {
			console.log(`GameMatch: Ctrl+${event.key} detected - showing disabled message`);
			event.preventDefault();
			
			console.log("GameMatch: Setting modal active to true");
			// TODO: eliminar comentario - Activamos la bandera global pa que nadie más pueda tocar teclas
			SPA.setGlobalModalActive(true);
			
			console.log("GameMatch: Enabling modal key handler with Enter callback");
			// TODO: eliminar comentario - Habilitamos el handler que solo deja pasar Enter, con callback pa limpiar cuando termine
			SPA.enableGlobalModalKeyHandler(() => {
				console.log("GameMatch: Enter callback executed for Ctrl+F5/R alert");
				SPA.setGlobalModalActive(false);
				SPA.disableGlobalModalKeyHandler();
			});
			
			setTimeout(() => {
				console.log("GameMatch: Showing alert for disabled key combination during game");
				alert("This key combination is disabled during the game.");
				console.log("GameMatch: Alert closed, cleaning up modal state");
				// TODO: eliminar comentario - Limpiamos to el estado del modal cuando se cierre el alert
				SPA.setGlobalModalActive(false);
				SPA.disableGlobalModalKeyHandler();
			}, 0);
			return;
		}

		if (event.key === "F5") {
			console.log("GameMatch: F5 detected - showing game exit confirmation");
			event.preventDefault();
			
			console.log("GameMatch: Setting modal active to true for F5 confirm");
			// TODO: eliminar comentario - Activamos la bandera pa F5 confirm en la partida
			SPA.setGlobalModalActive(true);
			
			console.log("GameMatch: Enabling modal key handler for F5 confirm");
			// TODO: eliminar comentario - Montamos el handler pa F5 confirm con su callback de limpieza
			SPA.enableGlobalModalKeyHandler(() => {
				console.log("GameMatch: Enter callback executed for F5 confirm");
				SPA.setGlobalModalActive(false);
				SPA.disableGlobalModalKeyHandler();
			});
			
			setTimeout(() => {
				console.log("GameMatch: Showing F5 confirmation dialog for game");
				const confirmExit = confirm("Are you sure you want to reload and exit the current game?");
				console.log(`GameMatch: F5 confirmation result: ${confirmExit}`);
				
				if (confirmExit) {
					console.log("GameMatch: User confirmed F5 - exiting game and reloading");
					// TODO: eliminar comentario - Si el malagueño confirma, destruimos la partida y recargamos la página
					this.destroy();
					location.reload();
				} else {
					console.log("GameMatch: User cancelled F5 - staying in game");
				}
				
				console.log("GameMatch: F5 confirm dialog closed, cleaning up modal state");
				// TODO: eliminar comentario - Limpiamos el estado del modal se confirme o no
				SPA.setGlobalModalActive(false);
				SPA.disableGlobalModalKeyHandler();
			}, 0);
		}
		
		if (event.key === "Escape") {
			console.log("GameMatch: Escape detected - showing game exit confirmation");
			event.preventDefault();
			
			console.log("GameMatch: Setting modal active to true for Escape confirm");
			// TODO: eliminar comentario - Activamos la bandera pa Escape confirm en la partida
			SPA.setGlobalModalActive(true);
			
			console.log("GameMatch: Enabling modal key handler for Escape confirm");
			// TODO: eliminar comentario - Montamos el handler pa Escape confirm con su callback de limpieza
			SPA.enableGlobalModalKeyHandler(() => {
				console.log("GameMatch: Enter callback executed for Escape confirm");
				SPA.setGlobalModalActive(false);
				SPA.disableGlobalModalKeyHandler();
			});
			
			setTimeout(() => {
				console.log("GameMatch: Showing Escape confirmation dialog for game");
				const confirmExit = confirm("This will exit the current game and go to Game Lobby. Are you sure?");
				console.log(`GameMatch: Escape confirmation result: ${confirmExit}`);
				
				if (confirmExit) {
					console.log("GameMatch: User confirmed Escape - exiting to game lobby");
					// TODO: eliminar comentario - Si confirma, destruimos la partida y nos vamos al lobby de juegos
					this.destroy();
					window.location.href = "#game-lobby";
				} else {
					console.log("GameMatch: User cancelled Escape - staying in game");
				}
				
				console.log("GameMatch: Escape confirm dialog closed, cleaning up modal state");
				// TODO: eliminar comentario - Limpiamos el estado del modal se confirme o no
				SPA.setGlobalModalActive(false);
				SPA.disableGlobalModalKeyHandler();
			}, 0);
		}
	}

	private enableGameKeyGuard(): void {
		console.log("GameMatch: Enabling game key guard");
		if (!this.boundKeyHandler) {
			// TODO: eliminar comentario - Vinculamos el handler de evaluación de teclas al contexto de esta clase
			this.boundKeyHandler = this.evaluateKeyEvent.bind(this);
			// TODO: eliminar comentario - Añadimos el listener con capture pa que vaya por delante de otros handlers
			document.addEventListener('keydown', this.boundKeyHandler, true);
			console.log("GameMatch: Game key handler enabled");
		}
	}

	private disableGameKeyGuard(): void {
		console.log("GameMatch: Disabling game key guard");
		if (this.boundKeyHandler) {
			// TODO: eliminar comentario - Removemos el listener y limpiamos la referencia
			document.removeEventListener('keydown', this.boundKeyHandler, true);
			this.boundKeyHandler = null;
			console.log("GameMatch: Game key handler disabled");
		}
	}
}

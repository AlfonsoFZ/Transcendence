/**
 * types.ts file is to have interface type (if needed)
 */

import { GamePlayer } from '../game/types.js';
// Game state refers to the current values/positions of the game elements
export interface    GameState
{
	ball?: { x: number; y: number };
	paddles: {
		player1?: { y: number };
		player2?: { y: number };
	};
	scores: [number, number];
}

// GameData refers later to gameLogs on backend
export interface	TournamentData
{
	id: string;
	mode: string;
	players?: GamePlayer[] | null;
	startTime: number;
	config?: TournamentConfig;
	result?: {
		winner: string;
	};
	gameIds?: string[]; // IDs of games played in the tournament
	readyState: boolean;
}

// Basic game configuration settings, may need to add more later
export interface	TournamentConfig
{
	numberOfPlayers: number; 
	scoreLimit: number;
	difficulty: 'easy' | 'medium' | 'hard';
}

// Player data object, not using it much in front yet, 
// but keeping it similar to backend just in case
export interface TournamentPlayer
{
	Index: string;
	status: 'pending' | 'ready' | 'waiting'; //pending not regiser, ready is registered, waiting is waiting for other players (remote)
	gameplayer: GamePlayer;
}

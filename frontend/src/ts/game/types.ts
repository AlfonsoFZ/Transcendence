/**
 * types.ts file is to have interface type (if needed)
 */

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

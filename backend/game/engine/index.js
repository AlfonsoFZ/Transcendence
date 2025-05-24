/**
 * index.js will work as a header file to include methods of GameSession class
 * this way we can have the game logic separated in several files for better readbility
 * Attach all methods to the class by using the syntax: "class.prototype.method = method" 
 */
import GameSession from './GameSession.js';
import { resetState, update, checkScoring } from './gameState.js';
import { resetBall, checkPaddleCollision } from './physics.js';
import { addPlayer, removePlayer, getPlayerState, getPlayerView } from './players.js';
import { startAI } from './ai.js';
import { broadcastState, getConnections } from './network.js';

// From gameState.js
GameSession.prototype.resetState = resetState;
GameSession.prototype.update = update;
GameSession.prototype.checkScoring = checkScoring;

// From physics.js
GameSession.prototype.checkPaddleCollision = checkPaddleCollision;
GameSession.prototype.resetBall = resetBall;

GameSession.prototype.addPlayer = addPlayer;
GameSession.prototype.removePlayer = removePlayer;
GameSession.prototype.getPlayerState = getPlayerState;
GameSession.prototype.getPlayerView = getPlayerView;
GameSession.prototype.startAI = startAI;
GameSession.prototype.broadcastState = broadcastState;
GameSession.prototype.getConnections = getConnections;

export default GameSession;

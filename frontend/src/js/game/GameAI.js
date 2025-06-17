export class GameAI {
    constructor(game) {
        this.intervalId = null;
        this.game = game;
    }
    start() {
        this.intervalId = window.setInterval(() => this.update(), 16);
    }
    stop() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    update() {
        var _a, _b, _c, _d, _e;
        const gameState = this.game.getGameRender().gameState;
        if (!gameState || !this.game.getGameConnection().socket)
            return;
        const ballY = (_b = (_a = gameState.ball) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : 0.5;
        const paddleY = (_d = (_c = gameState.paddles.player2) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0.5;
        const tolerance = 0.02;
        let up = false, down = false;
        if (ballY < paddleY - tolerance)
            up = true;
        else if (ballY > paddleY + tolerance)
            down = true;
        (_e = this.game.getGameConnection().socket) === null || _e === void 0 ? void 0 : _e.send(JSON.stringify({
            type: 'PLAYER_INPUT',
            input: {
                player: 'player2',
                up,
                down
            }
        }));
    }
}

/**
 * GameControllers.ts -> Handles all input and controller logic for the game
 * This is an auxiliar component to keep GameUI shorter and better readable
 */
export class GameControllers {
    constructor(game, aiSide) {
        this.keyState = { w: false, s: false, ArrowUp: false, ArrowDown: false };
        this.inputInterval = null;
        this.listenersActive = false;
        this.aiSide = null;
        this.game = game;
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);
        this.aiSide = aiSide;
    }
    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        let keyChanged = false;
        if (key === 'w' && !this.keyState.w) {
            this.keyState.w = true;
            keyChanged = true;
        }
        else if (key === 's' && !this.keyState.s) {
            this.keyState.s = true;
            keyChanged = true;
        }
        else if (key === 'arrowup' && !this.keyState.ArrowUp) {
            this.keyState.ArrowUp = true;
            keyChanged = true;
        }
        else if (key === 'arrowdown' && !this.keyState.ArrowDown) {
            this.keyState.ArrowDown = true;
            keyChanged = true;
        }
        if (keyChanged && (this.keyState.w || this.keyState.s || this.keyState.ArrowUp || this.keyState.ArrowDown))
            this.startSendingInputs();
    }
    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if (key === 'w')
            this.keyState.w = false;
        else if (key === 's')
            this.keyState.s = false;
        else if (key === 'arrowup')
            this.keyState.ArrowUp = false;
        else if (key === 'arrowdown')
            this.keyState.ArrowDown = false;
        if (!this.keyState.w && !this.keyState.s && !this.keyState.ArrowUp && !this.keyState.ArrowDown)
            this.stopSendingInputs();
    }
    startSendingInputs() {
        // Only start if we haven't already
        if (this.inputInterval)
            return;
        // Send inputs (60fps)
        this.inputInterval = window.setInterval(() => {
            var _a, _b, _c, _d;
            if (!this.game.getGameConnection().socket)
                return;
            // On 1vAI - Fix controls for human side (not always player1 as before)
            if (this.aiSide) {
                const humanSide = this.aiSide === 'player1' ? 'player2' : 'player1';
                if (humanSide === 'player1') {
                    (_a = this.game.getGameConnection().socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                        type: 'PLAYER_INPUT',
                        input: {
                            player: 'player1',
                            up: this.keyState.w,
                            down: this.keyState.s
                        }
                    }));
                }
                else if (humanSide === 'player2') {
                    (_b = this.game.getGameConnection().socket) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                        type: 'PLAYER_INPUT',
                        input: {
                            player: 'player2',
                            up: this.keyState.ArrowUp,
                            down: this.keyState.ArrowDown
                        }
                    }));
                }
            }
            else {
                // Set player1 control ipunt - On regular game or Remote being HOST / GAME CREATOR
                if (this.game.getGameIsHost()) {
                    (_c = this.game.getGameConnection().socket) === null || _c === void 0 ? void 0 : _c.send(JSON.stringify({
                        type: 'PLAYER_INPUT',
                        input: {
                            player: 'player1',
                            up: this.keyState.w,
                            down: this.keyState.s
                        }
                    }));
                }
                // Allow player2 input if 1v1 mode or remote game joined (not being HOST / CREATOR)
                if (this.game.getGameLog().mode === '1v1'
                    || (this.game.getGameLog().mode === 'remote' && !this.game.getGameIsHost())) {
                    (_d = this.game.getGameConnection().socket) === null || _d === void 0 ? void 0 : _d.send(JSON.stringify({
                        type: 'PLAYER_INPUT',
                        input: {
                            player: 'player2',
                            up: this.keyState.ArrowUp,
                            down: this.keyState.ArrowDown
                        }
                    }));
                }
            }
        }, 16);
    }
    ;
    stopSendingInputs() {
        if (this.inputInterval) {
            window.clearInterval(this.inputInterval);
            this.inputInterval = null;
        }
    }
    ;
    /**
     * Set up keyboard controllers for different game modes
     * @param mode Game mode ('1vAI', '1v1', 'remote')
     * @returns Cleanup function
     */
    setupControllers() {
        this.cleanup();
        if (!this.listenersActive) {
            document.addEventListener('keydown', this.keydownListener);
            document.addEventListener('keyup', this.keyupListener);
            this.listenersActive = true;
        }
    }
    /**
     * Aux method to clean all controller listeners and resources such as intervals
     */
    cleanup() {
        window.clearInterval(this.inputInterval);
        if (this.listenersActive) {
            document.removeEventListener('keydown', this.keydownListener);
            document.removeEventListener('keyup', this.keyupListener);
            this.listenersActive = false;
        }
    }
    destroy() {
        this.cleanup();
        this.game = null;
    }
}

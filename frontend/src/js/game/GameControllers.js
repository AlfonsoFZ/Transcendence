/**
 * GameControllers.ts -> Handles all input and controller logic for the game
 * This is an auxiliar component to keep GameUI shorter and better readable
 */
export class GameControllers {
    constructor(game) {
        this.keyState = { w: false, s: false, ArrowUp: false, ArrowDown: false };
        this.inputInterval = null;
        this.listenersActive = false;
        this.game = game;
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);
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
            var _a, _b;
            if (!this.game.getGameConnection().socket)
                return;
            // Always send player1 input
            if (this.game.getGameIsHost()) {
                (_a = this.game.getGameConnection().socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                    type: 'PLAYER_INPUT',
                    input: {
                        player: 'player1',
                        up: this.keyState.w,
                        down: this.keyState.s
                    }
                }));
            }
            // Send player2 input if 1v1 mode
            if (this.game.getGameLog().mode === '1v1'
                || (this.game.getGameLog().mode === 'remote' && !this.game.getGameIsHost())) {
                (_b = this.game.getGameConnection().socket) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                    type: 'PLAYER_INPUT',
                    input: {
                        player: 'player2',
                        up: this.keyState.ArrowUp,
                        down: this.keyState.ArrowDown
                    }
                }));
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

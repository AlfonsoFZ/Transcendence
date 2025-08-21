var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { showMessage } from "../modal/showMessage.js";
import { initOnlineSocket, onlineSocket } from "../friends/onlineUsersSocket.js";
export class SPA {
    constructor(containerId) {
        this.currentGame = null;
        this.currentTournament = null;
        this.currentStep = null;
        // TODO: eliminar comentario - Bandera global para controlar cuando existe un modal abierto, evitando conflictos con F5 y otras teclas del sistema
        this.isModalActive = false; // Flag global para controlar modales activos
        // TODO: eliminar comentario - Manejador encargado de capturar eventos de teclado cuando hay modal activo, permitiendo únicamente la tecla Enter
        this.modalKeyHandler = null; // Handler para teclas en modal
        this.routes = {
            'home': { module: '../home/homeRender.js', protected: false },
            'login': { module: '../login/loginRender.js', protected: false },
            'register': { module: '../login/registerRender.js', protected: false },
            'game-lobby': { module: '../game/Game.js', protected: true },
            'game-match': { module: '../game/GameMatch.js', protected: true },
            'tournament-lobby': { module: '../tournament/Tournament.js', protected: true },
            'friends': { module: '../friends/friendsRender.js', protected: true },
            'chat': { module: '../chat/chatRender.js', protected: true },
            'stats': { module: '../stats/statsRender.js', protected: true },
            'logout': { module: '../login/logoutRender.js', protected: true },
            'profile': { module: '../profile/userProfileRender.js', protected: true }
        };
        this.container = document.getElementById(containerId);
        SPA.instance = this;
        this.loadHEaderAndFooter();
        this.loadStep();
        // TODO: eliminar comentario - Configuración del manejador global para interceptar F5 y otras teclas problemáticas desde el inicio de la aplicación
        this.setupGlobalKeyHandler();
        // Changes to advise the user when they leave a tournament in progress
        //it will reset the tournament guards and delete TempUsers
        window.onpopstate = () => {
            var _a, _b;
            if (this.currentTournament && typeof this.currentTournament.getTournamentId === 'function') {
                const tournamentId = this.currentTournament.getTournamentId();
                const warningFlag = this.currentTournament.LeaveWithoutWarningFLAG;
                // If the tournament is in progress, show a warning message is it is not already shown
                if (typeof tournamentId !== 'undefined' && tournamentId !== null && tournamentId > -42
                    && warningFlag !== true) {
                    showMessage("Tournament in progress aborted?", 5000);
                    const tournamentUI = (_b = (_a = this.currentTournament).getTournamentUI) === null || _b === void 0 ? void 0 : _b.call(_a);
                    if (tournamentUI && typeof tournamentUI.resetTournament === 'function') {
                        tournamentUI.resetTournament();
                    }
                    // loop to wait for the message to be closed
                    const messageContainer = document.getElementById("message-container");
                    const intervalId = setInterval(() => {
                        if ((messageContainer === null || messageContainer === void 0 ? void 0 : messageContainer.style.display) === 'none') {
                            clearInterval(intervalId);
                        }
                    }, 1000);
                }
                const step = location.hash.replace('#', '') || 'home';
                this.loadStep();
            }
            else {
                const step = location.hash.replace('#', '') || 'home';
                this.loadStep();
            }
        };
        window.addEventListener("pageshow", (event) => {
            if (event.persisted && location.hash === '#login') {
                console.log("Recargando el step de login");
                const appContainer = document.getElementById('app-container');
                if (appContainer) {
                    appContainer.innerHTML = '';
                }
                this.loadStep();
            }
        });
    }
    // TODO: eliminar comentario - Manejador global para capturar F5 y otras combinaciones de teclas problemáticas desde el inicio de la aplicación
    setupGlobalKeyHandler() {
        // TODO: eliminar comentario - Manejador con alta prioridad para interceptar F5 antes que otros event listeners
        const globalKeyHandler = (event) => {
            // TODO: eliminar comentario - Verificación de si estamos en pasos protegidos donde no deseamos interrupciones del teclado
            const isInProtectedStep = this.currentStep === 'tournament-lobby' || this.currentStep === 'game-match';
            // TODO: eliminar comentario - Solo en zonas protegidas con modal activo bloqueamos todas las teclas excepto Enter
            if (isInProtectedStep && this.isModalActive) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                if (event.key !== "Enter") {
                    showMessage("Please close the modal to continue", 2000);
                    return false;
                }
            }
            // TODO: eliminar comentario - Interceptamos F5 en todos los pasos excepto 'home' para evitar recargas no deseadas
            if (this.currentStep !== 'home' &&
                (event.key === "F5" || (event.ctrlKey && event.key === "r"))) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                showMessage("Page refresh is only allowed from home", 2000);
                return false;
            }
        };
        // TODO: eliminar comentario - Registro del manejador con máxima prioridad para garantizar la interceptación antes que otros listeners
        document.addEventListener('keydown', globalKeyHandler, true);
        window.addEventListener('keydown', globalKeyHandler, true);
        // TODO: eliminar comentario - Este manejador previene el cierre de página cuando hay modal activo o no estamos en home
        window.addEventListener('beforeunload', (event) => {
            const isInProtectedStep = this.currentStep === 'tournament-lobby' || this.currentStep === 'game-match';
            if ((isInProtectedStep && this.isModalActive) || this.currentStep !== 'home') {
                event.preventDefault();
                event.returnValue = '';
            }
        });
    }
    loadHEaderAndFooter() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // cargar el header
                const headerResponse = yield fetch('../../html/layout/header.html');
                if (headerResponse.ok) {
                    const headerContent = yield headerResponse.text();
                    const headerElement = document.getElementById('header-container');
                    if (headerElement) {
                        headerElement.innerHTML = headerContent;
                    }
                }
                else {
                    console.error('Error al cargar el header:', headerResponse.statusText);
                }
                // Cargar el footer
                const footerResponse = yield fetch('../../html/layout/footer.html');
                if (footerResponse.ok) {
                    const footerContent = yield footerResponse.text();
                    const footerElement = document.getElementById('footer-container');
                    if (footerElement) {
                        footerElement.innerHTML = footerContent;
                    }
                    console.log('footer cargado');
                }
                else {
                    console.error('Error al cargar el footer:', footerResponse.statusText);
                }
            }
            catch (error) {
                console.error('Error al cargar el footer:', error);
            }
        });
    }
    navigate(step) {
        history.pushState({}, '', `#${step}`);
        this.loadStep();
    }
    loadStep() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            let step = location.hash.replace('#', '') || 'home';
            // this.navigate(step);
            // // Obtener la URL actual
            // let currentUrl = window.location.href;
            // // Eliminar todo lo que está después de la última barra
            // let baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
            // // Modificar la URL para que termine con /#home
            // let newUrl = baseUrl + '#home';
            // // Actualizar la URL sin recargar la página
            // history.replaceState(null, '', newUrl);
            // DEBUG: show why the "leaving game-match" branch may not run
            try {
                console.debug('SPA.leave-check', {
                    currentStep: this.currentStep,
                    nextStep: step,
                    hasCurrentGame: !!this.currentGame,
                    getGameConnectionResult: (_b = (_a = this.currentGame) === null || _a === void 0 ? void 0 : _a.getGameConnection) === null || _b === void 0 ? void 0 : _b.call(_a),
                    hasSocket: !!((_e = (_d = (_c = this.currentGame) === null || _c === void 0 ? void 0 : _c.getGameConnection) === null || _d === void 0 ? void 0 : _d.call(_c)) === null || _e === void 0 ? void 0 : _e.socket),
                    isGameActive: (_g = (_f = this.currentGame) === null || _f === void 0 ? void 0 : _f.isGameActive) === null || _g === void 0 ? void 0 : _g.call(_f)
                });
            }
            catch (e) {
                console.debug('SPA.leave-check error', e);
            }
            // Handle leaving game-match step on active game
            if (this.currentStep === 'game-match')
                this.handleLeavingMatchStep(step);
            this.currentStep = step;
            const routeConfig = this.routes[step];
            if (routeConfig) {
                const module = yield import(`./${routeConfig.module}`);
                let stepInstance;
                if (step === 'game-match') {
                    stepInstance = new module.default(this.currentGame, this.currentTournament);
                    if (this.currentGame && stepInstance)
                        this.currentGame.setGameMatch(stepInstance);
                }
                else if (step === 'game-lobby') {
                    stepInstance = new module.default('app-container');
                    this.currentGame = stepInstance;
                }
                else if (step === 'tournament-lobby') {
                    stepInstance = new module.default('app-container');
                    this.currentTournament = stepInstance;
                    console.log('tournament-lobby currentTournament: ', this.currentTournament);
                }
                else
                    stepInstance = new module.default('app-container');
                const user = yield stepInstance.checkAuth();
                if (user) {
                    console.log("Usuario autenticado: ", user);
                    // Si el usuario está autenticado, inicializamos el socket de usuarios online
                    if (!onlineSocket || onlineSocket.readyState === WebSocket.CLOSED) {
                        initOnlineSocket();
                    }
                }
                else {
                    console.log("Usuario no autenticado: ", user);
                }
                if (routeConfig.protected && !user) {
                    console.warn(`Acceso denegado a la ruta protegida: ${step}`);
                    this.navigate('login');
                    return;
                }
                yield stepInstance.init();
            }
            else {
                showMessage('url does not exist', 2000);
                window.location.hash = '#home';
            }
        });
    }
    static getInstance() {
        return SPA.instance;
    }
    // TODO: eliminar comentario - Métodos para gestionar la bandera global de modal activo, permitiendo controlar el estado de modales
    setModalActive(active) {
        this.isModalActive = active;
    }
    isModalCurrentlyActive() {
        return this.isModalActive;
    }
    // TODO: eliminar comentario - Habilita el manejador de teclas para modal que únicamente permite el paso de la tecla Enter
    enableModalKeyHandler(onEnterCallback) {
        if (this.modalKeyHandler) {
            // TODO: eliminar comentario - Si existe un manejador previo, se remueve antes de instalar el nuevo
            this.disableModalKeyHandler();
        }
        this.modalKeyHandler = (event) => {
            // TODO: eliminar comentario - Prevención del comportamiento por defecto en todos los casos para evitar acciones no deseadas
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            // TODO: eliminar comentario - Bloqueo de todas las teclas excepto Enter, manteniendo únicamente la funcionalidad de confirmación
            if (event.key !== "Enter") {
                showMessage("Please close the modal to continue", 2000);
                return false; // Prevenir propagación adicional
            }
            // TODO: eliminar comentario - Si es Enter, se ejecuta el callback proporcionado para realizar la limpieza correspondiente
            if (event.key === "Enter" && onEnterCallback) {
                onEnterCallback();
            }
            return false; // TODO: eliminar comentario - Prevención de cualquier propagación adicional del evento
        }; // TODO: eliminar comentario - Registro de múltiples listeners para máxima captura de eventos de teclado
        document.addEventListener('keydown', this.modalKeyHandler, true); // Capture
        document.addEventListener('keypress', this.modalKeyHandler, true); // Press
        document.addEventListener('keyup', this.modalKeyHandler, true); // Up
        // TODO: eliminar comentario - Registro adicional en window para capturar eventos globales sin excepciones
        window.addEventListener('keydown', this.modalKeyHandler, true);
    }
    // TODO: eliminar comentario - Deshabilita el manejador de teclas para modal, removiendo todos los listeners registrados
    disableModalKeyHandler() {
        if (this.modalKeyHandler) {
            // TODO: eliminar comentario - Remoción de todos los listeners registrados para garantizar limpieza completa
            document.removeEventListener('keydown', this.modalKeyHandler, true);
            document.removeEventListener('keypress', this.modalKeyHandler, true);
            document.removeEventListener('keyup', this.modalKeyHandler, true);
            window.removeEventListener('keydown', this.modalKeyHandler, true);
            this.modalKeyHandler = null;
        }
    }
    // TODO: eliminar comentario - Métodos estáticos para acceso simplificado desde cualquier módulo sin necesidad de obtener la instancia
    static setGlobalModalActive(active) {
        if (SPA.instance) {
            SPA.instance.setModalActive(active);
        }
    }
    static isGlobalModalActive() {
        const result = SPA.instance ? SPA.instance.isModalCurrentlyActive() : false;
        return result;
    }
    static enableGlobalModalKeyHandler(onEnterCallback) {
        if (SPA.instance) {
            SPA.instance.enableModalKeyHandler(onEnterCallback);
        }
    }
    static disableGlobalModalKeyHandler() {
        if (SPA.instance) {
            SPA.instance.disableModalKeyHandler();
        }
    }
    handleLeavingMatchStep(nextStep) {
        var _a, _b, _c, _d;
        //nexStep as param in case later need to handle different scenarios
        if (!this.currentGame)
            return;
        const log = this.currentGame.getGameLog();
        const match = this.currentGame.getGameMatch();
        if (log.mode === 'remote' && this.currentGame.getGameConnection() &&
            this.currentGame.getGameConnection().socket && this.currentGame.isGameActive()) {
            const username = this.currentGame.getGameIsHost()
                ? (_a = log.playerDetails.player1) === null || _a === void 0 ? void 0 : _a.username
                : (_b = log.playerDetails.player2) === null || _b === void 0 ? void 0 : _b.username;
            (_d = (_c = this.currentGame.getGameConnection()) === null || _c === void 0 ? void 0 : _c.socket) === null || _d === void 0 ? void 0 : _d.send(JSON.stringify({
                type: 'PAUSE_GAME',
                reason: `${username} left the game`
            }));
        }
        if (match) {
            match.updatePlayerActivity(false);
            match.destroy();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => new SPA('content'));

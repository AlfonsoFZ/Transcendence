import { Step } from "./stepRender.js";
import { showMessage } from "../modal/showMessage.js";
import Game from "../game/Game.js"
import { initOnlineSocket, onlineSocket } from "../friends/onlineUsersSocket.js";
import Tournament from "../tournament/Tournament.js";

export class SPA {
    private container: HTMLElement;
    private static instance: SPA; // Guardamos una referencia estática y privada para solo poder acceder con el getter
	public currentGame: Game | null = null;
	public currentTournament: Tournament | null = null;
	private currentStep: string | null = null;
	private previousHash: string | null = null;
	private currentHash: string | null = null;
	private isInternalNavigation: boolean = false; // Flag para evitar dobles llamadas

    private routes: { [key: string]: { module: string; protected: boolean } } = {
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
		'profile': { module: '../profile/userProfileRender.js', protected: true },
    };

    public constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
		SPA.instance = this;
        this.loadNavigationState(); // Cargar estado previo si existe
        
        // Inicializar currentHash con el hash actual de la URL
        this.currentHash = location.hash.replace('#', '') || 'home';
        
        this.loadHEaderAndFooter();	
		this.loadStep();
		// Changes to advise the user when they leave a tournament in progress
		//it will reset the tournament guards and delete TempUsers
		window.onpopstate = () => {
			// NO llamar storeNavigationState aquí porque loadStep() lo manejará
			
			if (this.currentTournament && typeof this.currentTournament.getTournamentId === 'function') {
				const tournamentId = this.currentTournament.getTournamentId();
				const warningFlag = this.currentTournament.LeaveWithoutWarningFLAG;
				// If the tournament is in progress, show a warning message is it is not already shown
				if (typeof tournamentId !== 'undefined' && tournamentId !== null && tournamentId > -42
					&& warningFlag!== true) {
					showMessage("Tournament in progress aborted?", 5000);
					const tournamentUI = this.currentTournament.getTournamentUI?.();
					if (tournamentUI && typeof tournamentUI.resetTournament === 'function') {
						tournamentUI.resetTournament();
					}
					// loop to wait for the message to be closed
					const messageContainer = document.getElementById("message-container");
						const intervalId = setInterval(() => {
							if (messageContainer?.style.display === 'none') {
								clearInterval(intervalId);
							}
						}, 1000);
					
				}
				this.loadStep(); // loadStep manejará el storeNavigationState
			}else {
				this.loadStep(); // loadStep manejará el storeNavigationState
				}
			}
		
		window.addEventListener("pageshow", (event) => {
			if (event.persisted && location.hash === '#login') {
				console.log("Recargando el step de login" );
				const appContainer = document.getElementById('app-container');
				if (appContainer) {
					appContainer.innerHTML = '';
				}
				this.loadStep();
			}
		});
    }

    private async loadHEaderAndFooter() {

        try {
			// cargar el header

			const headerResponse = await fetch('../../html/layout/header.html');
			if (headerResponse.ok) {
				const headerContent = await headerResponse.text();
				const headerElement = document.getElementById('header-container');
				if (headerElement) {
					headerElement.innerHTML = headerContent;
				}
			} else {
				console.error('Error al cargar el header:', headerResponse.statusText);
			}
			// Cargar el footer
            const footerResponse = await fetch('../../html/layout/footer.html');
            if (footerResponse.ok) {
                const footerContent = await footerResponse.text();
                const footerElement = document.getElementById('footer-container');
                if (footerElement) {
                    footerElement.innerHTML = footerContent;
                }
				console.log ('footer cargado');
            } else {
                console.error('Error al cargar el footer:', footerResponse.statusText);
            }
        } catch (error) {
            console.error('Error al cargar el footer:', error);
        }
    }

    /**
     * Almacena los valores de hash y tournament ID en sessionStorage
     */
    private storeNavigationState(newHash?: string): void {
        try {
            // Guardar el hash anterior (el que estaba antes del cambio)
            const oldPrevious = this.previousHash;
            const oldCurrent = this.currentHash;
            
            this.previousHash = this.currentHash;
            
            // Actualizar el hash actual
            this.currentHash = newHash || location.hash.replace('#', '') || 'home';
            
            // Obtener el ID del torneo actual si existe
            let tournamentId: number | null = null;
            if (this.currentTournament && typeof this.currentTournament.getTournamentId === 'function') {
                const id = this.currentTournament.getTournamentId();
                tournamentId = (typeof id !== 'undefined' && id !== null) ? id : null;
            }
            
            // Almacenar en sessionStorage
            sessionStorage.setItem('spa_previousHash', this.previousHash || '');
            sessionStorage.setItem('spa_currentHash', this.currentHash);
            sessionStorage.setItem('spa_tournamentId', tournamentId?.toString() || '');
            
            console.log('Navigation state stored:', {
                'OLD previous': oldPrevious,
                'OLD current': oldCurrent,
                'NEW previous': this.previousHash,
                'NEW current': this.currentHash,
                'tournamentId': tournamentId,
                'Called from': new Error().stack?.split('\n')[2]?.trim() // Para ver desde dónde se llama
            });
            
        } catch (error) {
            console.error('Error storing navigation state:', error);
        }
    }

    /**
     * Recupera los valores almacenados del sessionStorage
     */
    private loadNavigationState(): void {
        try {
            this.previousHash = sessionStorage.getItem('spa_previousHash') || null;
            this.currentHash = sessionStorage.getItem('spa_currentHash') || null;
            
            console.log('Navigation state loaded:', {
                previousHash: this.previousHash,
                currentHash: this.currentHash,
                tournamentId: sessionStorage.getItem('spa_tournamentId')
            });
        } catch (error) {
            console.error('Error loading navigation state:', error);
        }
    }

    /**
     * Obtiene los valores actuales de navegación
     */
    public getNavigationState(): { previousHash: string | null, currentHash: string | null, tournamentId: string | null } {
        return {
            previousHash: this.previousHash,
            currentHash: this.currentHash,
            tournamentId: sessionStorage.getItem('spa_tournamentId')
        };
    }

    navigate(step: string) {
        console.log('🔄 SPA.navigate() called with step:', step, 'isInternal:', this.isInternalNavigation, 'from:', new Error().stack?.split('\n')[2]?.trim());
        
        // Solo almacenar estado si no es una navegación interna (redirect)
        if (!this.isInternalNavigation) {
            this.storeNavigationState(step); // Almacenar estado ANTES de cambiar la URL
        } else {
            console.log('⚡ Skipping storeNavigationState for internal navigation');
            this.isInternalNavigation = false; // Reset flag
        }
        
        history.pushState({}, '', `#${step}`);
        this.loadStep();
    }

	async loadStep() {
		let step = location.hash.replace('#', '') || 'home';
		console.log('🏁 loadStep() called with step:', step, 'currentHash before:', this.currentHash);
		
		// NO llamar storeNavigationState aquí porque ya se llamó en navigate()
		// Solo actualizar si venimos de una navegación directa (URL cambió externamente)
		if (this.currentHash !== step) {
			console.log('📝 Calling storeNavigationState from loadStep because hash changed externally');
			this.storeNavigationState(step);
		} else {
			console.log('⏭️ Skipping storeNavigationState in loadStep - already called from navigate()');
		}
		
		// this.navigate(step);

		// // Obtener la URL actual
		// let currentUrl = window.location.href;

		// // Eliminar todo lo que está después de la última barra
		// let baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);

		// // Modificar la URL para que termine con /#home
		// let newUrl = baseUrl + '#home';

		// // Actualizar la URL sin recargar la página
		// history.replaceState(null, '', newUrl);

		// Handle leaving game-match step on active game
		if (this.currentStep === 'game-match' && step !== 'game-match' &&
				this.currentGame && this.currentGame.getGameConnection() &&
				this.currentGame.getGameConnection().socket &&
				this.currentGame.isGameActive())
		{
			const	log = this.currentGame.getGameLog();
			const	username = this.currentGame.getGameIsHost()
				? log.playerDetails.player1?.username
				: log.playerDetails.player2?.username;
			this.currentGame.getGameConnection()?.socket?.send(
				JSON.stringify({
					type: 'PAUSE_GAME',
					reason: `${username} left the game`
				 })
			);
		}
        this.currentStep = step;
		
		const routeConfig = this.routes[step];
		if (routeConfig) {
			const module = await import(`./${routeConfig.module}`);
			let stepInstance;
			if (step === 'game-match')
			{	
				stepInstance = new module.default(this.currentGame, this.currentTournament);
				if (this.currentGame && stepInstance)
					this.currentGame.setGameMatch(stepInstance);
			}
			else if (step === 'game-lobby')
			{
				stepInstance = new module.default('app-container');
				this.currentGame = stepInstance;
			}
			else if (step === 'tournament-lobby')
			{
				if (!this.currentTournament || this.currentTournament.getTournamentId() === -42) {
					stepInstance = new module.default('app-container');
					this.currentTournament = stepInstance;
					console.log('tournament-lobby currentTournament: ', this.currentTournament);
				}
			}
			else
				stepInstance = new module.default('app-container');
			const user = await stepInstance.checkAuth();
			if (user) {
				console.log("Usuario autenticado: ", user);
				// Si el usuario está autenticado, inicializamos el socket de usuarios online
				if (!onlineSocket || onlineSocket.readyState === WebSocket.CLOSED) {
					initOnlineSocket();
				}
			} else {
				console.log("Usuario no autenticado: ", user);
			}
			if (routeConfig.protected && !user) {
				console.warn(`Acceso denegado a la ruta protegida: ${step}`);
				console.log('🚫 Redirecting to login due to auth failure');
				this.isInternalNavigation = true; // Marcar como navegación interna
				this.navigate('login');
				return;
			}
			await stepInstance.init();
		} else {
			showMessage('url does not exist', 2000);
			console.log('🏠 Redirecting to home due to invalid URL');
			this.isInternalNavigation = true; // Marcar como navegación interna
			this.navigate('home');
		}
	}
	public static getInstance(): SPA {
		return SPA.instance;
	}

}

document.addEventListener('DOMContentLoaded', () => new SPA('content'));


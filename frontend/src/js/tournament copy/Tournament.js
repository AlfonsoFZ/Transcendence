var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Step } from '../spa/stepRender.js';
import { TournamentUI } from '../tournament/TournamentUI.js';
// import { game } from '../game/Game.js';
// Default container ID (I think i should match HTML file)
const DEFAULT_CONTAINER_ID = "tournament-container";
export default class Tournament extends Step {
    /*********** CONSTRUCTOR ***************/
    constructor(containerId = DEFAULT_CONTAINER_ID) {
        super(containerId);
        this.tournamentId = null;
        this.findNextTournamentId().then(id => {
            this.tournamentId = id;
        });
        this.ui = new TournamentUI(this);
        // this.log = {
        // 	id: "tournament " + Date.now(),
        // 	mode: '',
        // 	player1: null,
        // 	player2: null,
        // 	startTime: 0,
        // 	config: undefined,
        // 	result: {winner: '', loser: '', score: [0,0]},
        // 	duration: 0,
        // 	tournamentId: null,
        // 	readyState: false
        // };
    }
    findNextTournamentId() {
        return __awaiter(this, void 0, void 0, function* () {
            return 42; // insert the functionto retrieve next tournament ID available
        });
    }
    render(appElement) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ui.initializeUI(appElement);
            // const menuContainer = document.getElementById("menu-container");
            // try {
            // 	console.log("En Play Tournament Step render");
            // 	const user = await this.checkAuth();
            // 	if (user) {		
            // 		// Retornar el contenido para usuarios autenticados
            // 		appElement.innerHTML = `
            // 				<div class="flex-grow flex flex-col items-center justify-center ">
            //    					<h1 class="text-4xl font-bold text-gray-800">Play Tournament Step</h1>
            // 				</div>
            // 		`;
            // 		} else {
            // 			// Retornar el contenido para usuarios no autenticados
            // 			appElement.innerHTML =  `
            // 				<div id="pong-container">
            // 					<div class="paddle left-paddle"></div>
            // 					<div class="ball"><img src="../img/bola.png" alt="Ball"></div>
            // 					<div class="paddle right-paddle"></div>
            // 				</div>
            // 			`;
            // 	}
            // } 
            // catch (error) {
            // 	console.error("Error en render:", error);
            // 	appElement.innerHTML =  `<div id="pong-container">Ocurrió un error al generar el contenido</div>`;
            // }
        });
    }
}

import { Step } from '../spa/stepRender.js';
import { TournamentUI } from '../tournament/TournamentUI.js';
// import { game } from '../game/Game.js';

// Default container ID (I think i should match HTML file)
const DEFAULT_CONTAINER_ID = "tournament-container";

export default class Tournament extends Step {
	
	protected tournamentId: number | null = null;
	// protected games: game[] | null = null;
	protected ui: TournamentUI;


	/*********** CONSTRUCTOR ***************/
	constructor(containerId: string = DEFAULT_CONTAINER_ID)
	{
		super(containerId);
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
		
	async findNextTournamentId(): Promise<number> {
		return 42; // insert the functionto retrieve next tournament ID available
	}

	async render(appElement: HTMLElement): Promise<void>  {
		await this.ui.initializeUI(appElement);

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
	}
}

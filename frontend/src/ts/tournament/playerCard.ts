import { TournamentPlayer } from "./types";

export class PlayerCard {
	private player_index: number;
	private templatePath: string;
	private scriptHandler?: () => void;
	protected el?: HTMLElement;
	protected tournamentPlayer: TournamentPlayer;

	constructor(playerIndex: number, container:HTMLElement, scriptHandler?: () => void) {
		console.log("Creating PlayerCard component");
		console.log("Player index:", playerIndex);
	  	console.log("Container element:", container);	
		this.player_index = playerIndex;		
	  	this.templatePath = "../html/tournament/PlayerForm.html";
	  	this.scriptHandler = scriptHandler;
		this.el = container;
		this.render(this.el);
		this.tournamentPlayer = {
			Index: playerIndex.toString(),
			status: 'pending', // Initial status
			gameplayer: { id: '', username: '', tournamentUsername:'',email:'',avatarPath:'' } // Assuming GamePlayer has these properties
		};
	}
  
	async render(target: HTMLElement, placeholders: Record<string, string> = {}) {
	  	const html = await this.loadTemplate();
		const parsed = html.replace(/\{\{\s*userIndex\s*\}\}/g, this.player_index.toString());
	    // const parsed = this.replacePlaceholders(html, placeholders);
	  	const wrapper = document.createElement('div');
		// console.log("Parsed HTML:", parsed);
	   	wrapper.innerHTML = parsed;
  
	  	this.el = wrapper.firstElementChild as HTMLElement;
	  	target.appendChild(this.el);
  
	  	if (this.scriptHandler) this.scriptHandler();
		this.setupEventListeners();
		// while (1)
		// {
		// 	if (this.tournamentPlayer.status != 'ready')
		// 	{
		// 		console.log("Waiting for playerCard " + (this.player_index + 1 ) + " to be ready");
		// 	} else 
		// 	{
		// 		break;
		// 	}
		// // Wait for the player to be ready
		// }
	}

	// Sets up event listeners for game mode buttons, which after will also set controllers
	setupEventListeners(){
		const playersLoginForm = document.getElementById(`players-login-form-${this.player_index}`) as HTMLFormElement;
		const playerEmail = document.getElementById(`players-email-${this.player_index}`) as HTMLInputElement;
		const playerPassword = document.getElementById(`players-password-${this.player_index}`) as HTMLInputElement;
		if (playersLoginForm) {
			playersLoginForm.addEventListener('submit', (event) => {
				event.preventDefault();
				console.log(`Player ${this.player_index} login form submitted`);
				console.log(`Email: ${playerEmail?.value}, Password: ${playerPassword?.value}`);
				console.log(`playerPassword: ${playerPassword?.value}`);
				// Handle login logic here
			});
		}
		const playersLogintBtn = document.getElementById(`players-login-btn-${this.player_index}`) as HTMLButtonElement;
		const guestTournamentName = document.getElementById(`guest-tournament-name-${this.player_index}`) as HTMLInputElement;
		
		const guestLoginForm = document.getElementById(`guests-login-form-${this.player_index}`) as HTMLFormElement;
		if (guestLoginForm) {
			guestLoginForm.addEventListener('submit', (event) => {
				event.preventDefault();
				console.log(`Guest Player ${this.player_index} login form submitted`);
				console.log(`Guest Tournament Name: ${guestTournamentName?.value}`);
				// Handle guest login logic here
			});
		}
		
		const PlayAsGuestBtn = document.getElementById(`players-guest-btn-${this.player_index}`) as HTMLButtonElement;
		if (playersLogintBtn) {
			playersLogintBtn.addEventListener('click', (event) => {
				event.preventDefault();
				console.log(`Player ${this.player_index} login button clicked`);
				// Handle login logic here
			});
		}

		const ErrorContainer = document.getElementById(`players-login-error-${this.player_index}`) as HTMLDivElement;
		const AiplayerBtn = document.getElementById(`players-ai-btn-${this.player_index}`) as HTMLButtonElement;
		if (AiplayerBtn) {
			AiplayerBtn.addEventListener('click', (event) => {
				event.preventDefault();
				console.log(`AI Player ${this.player_index} button clicked`);
			});
		}
	}
  
	private async loadTemplate(): Promise<string> {
	  const response = await fetch(this.templatePath);
	  return await response.text();
	}
  
	// private replacePlaceholders(template: string, data: Record<string, string>): string {
	//   return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
	// 	const trimmedKey = key.trim();
	// 	if (!(trimmedKey in data)) {
	// 	  console.warn(`Missing placeholder key: ${trimmedKey}`);
	// 	}
	// 	return data[trimmedKey] || '';
	//   });
	// }


						



  }
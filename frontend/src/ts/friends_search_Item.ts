/**
 * UserStatus
 * 0 - No friends - addfriend
 * 1 - Friends - removefriend
 * 2 - Pending request - cancel request
 * 3 - Request sent - accept request
 * 4 - Request received - go to request list
 */


/**
 * Friends list action buttons
 * 1 - Friends - removefriend
 * 2 - Block - unblock
 */

export class SearchItem {
	protected container: HTMLElement;
	protected user: [string, string] | null = null; // Almacena el id y nombre de usuario autenticado
	protected userStatus: number; // Almacena una función como manejador

	constructor(containerId: string, user: [string, string], userStatus: number, ) {
		this.container = document.getElementById(containerId) as HTMLElement;
		this.user = user;
		this.userStatus = userStatus; // Inicializa el estado de usuarios
		this.init();
	}

	
	async render(appElement: HTMLElement):Promise<void> {
		
		try {
			const response = await fetch("../html/search_item.html");
			if (!response.ok) throw new Error("Failed to load the HTML file");
			let htmlContent = await response.text();
			htmlContent = htmlContent
			console.log("userStatus:", this.userStatus);
			if (this.userStatus == 0) {
				htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="addFriendButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Friend</button>`);
			} else if (this.userStatus == 1) {
				htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="removeFriendButton" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Remove Friend</button>`);
			} else if (this.userStatus == 2) {
				htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="cancelRequestButton" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Cancel Request</button>`);
			} else if (this.userStatus == 3) {
				htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="acceptRequestButton" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Accept Request</button>`);
			} else if (this.userStatus == 4) {
				htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="declineRequestButton" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Decline Request</button>`);
			} else {
				htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="addFriendButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Friend</button>`);
			}

			if (this.user && this.user[0])
				htmlContent = htmlContent.replace("{{ id }}", this.user[0]);

			if (this.user && this.user[1])
				htmlContent = htmlContent.replace("{{ username }}", this.user[1]);
			console.log("htmlcontent: " + htmlContent);

			this.container.innerHTML += htmlContent;

		}catch (error) {
			console.error("Error al renderizar el elemento SearchItem:", error);
			this.container.innerHTML= '<div>Error retrieving user</div>';
		}
	}

	/**
		 * 
		 * @param appElement html al que se añadirá el componente
		 * 
		 */
	async initChild(appElement: HTMLElement) {

		if (appElement) {
			await this.render(appElement);
		}
	}

	/**
	 * Método para inicializar el paso se asegura que existen los elementos header, menu y app
	 * para poder renderizar el contenido correspondiente en cada slot o "placeholder"
	 */
	async init(){

		let appElement = this.container;	

		while (!appElement) {
			await new Promise(resolve => setTimeout(resolve, 100)); // Esperar 100ms antes de volver a comprobar
			appElement = this.container;	
		}
		this.initChild(appElement);
	}
}

import { Step } from '../spa/stepRender.js';
import { searchUsersFriends } from './friendsSearchUsers.js';
import { renderRelations } from './renderRelations.js';
import { getUserId } from '../chat/handleSenders.js';

export let currentUserId = "";

export default class Friends extends Step {
	
	async render(appElement: HTMLElement): Promise<void>  {
		sessionStorage.setItem("current-view", "Friends");
		if (!this.username) {
			this.username = await this.checkAuth();
		}
		try
		{
			const response = await fetch("../../html/friends/friends.html");
			if (!response.ok) throw new Error("Failed to load the HTML file");

			let htmlContent = await response.text();
			appElement.innerHTML =  htmlContent;
			
			let btnSearch =  document.getElementById("btnSearch");
			while (!btnSearch) {
				await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
				btnSearch = document.getElementById("btnSearch");
			}
			btnSearch.addEventListener("click", (event) => searchUsersFriends('boton', event));
			const userId = await getUserId(this.username!);
			currentUserId = userId;
			if (!userId) {
				throw new Error("User ID not found");
			}
			console.log("User ID:", userId);
			const relationsContainer = document.getElementById("relations-container") as HTMLDivElement;
			await renderRelations(relationsContainer!, userId);

			const eventKey = "onlineUsersUpdated";
			const listener = async () => {
				await renderRelations(relationsContainer!, userId);
			};
			// @ts-ignore
			if (!window._onlineUsersUpdatedListenerAdded) {
				window.addEventListener(eventKey, listener);
				// @ts-ignore
				window._onlineUsersUpdatedListenerAdded = true;
			}

		}catch (error) {
				console.error("Error loading HTML file:", error);
				appElement.innerHTML =  `<div id="pong-container">An error occurred while generating the content</div>`;
		}
	}
}

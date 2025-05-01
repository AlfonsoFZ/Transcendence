import { Step } from './stepRender.js';
import { searchUsersFriends } from './friendsSearchUsers.js';

export default class Friends extends Step {
	
	async render(appElement: HTMLElement): Promise<void>  {
		console.log("En Friend render");
		if (!this.username) {
			this.username = await this.checkAuth();
		}
		try
		{
			const response = await fetch("../html/friends.html");
			if (!response.ok) throw new Error("Failed to load the HTML file");

			let htmlContent = await response.text();
			appElement.innerHTML =  htmlContent;
			
			const btnSearch =  document.getElementById("btnSearch");
			if (btnSearch) {
				btnSearch.addEventListener("click", () => searchUsersFriends('boton'));
			}
		}catch (error) {
				console.error("Error loading HTML file:", error);
				appElement.innerHTML =  `<div id="pong-container">An error occurred while generating the content</div>`;
		}
	}
}
import { Step } from '../spa/stepRender.js'
import { getUserId } from './handleFetchers.js'
import { verifySocket } from './verifySocket.js'
import { checkIfGameIsRunning, launchGame, launchUI } from './launchGame.js'

export default class Chess extends Step {

	async render(appElement: HTMLElement): Promise<void> {
		sessionStorage.setItem("current-view", "Chess");
		if (!this.username) {
			this.username = await this.checkAuth();
		}
		try {
			const socket = verifySocket(Step.socket);
			const userId = await getUserId(this.username!);
			const data = checkIfGameIsRunning();
			if (!data)
				launchUI(socket, userId, appElement);
			else
				launchGame(socket, userId, data, appElement);
		}
		catch (error) {
			console.log(error);
			appElement.innerHTML = `<div id="pong-container">An error occurred while generating the content</div>`;
		}
	}
}

import { Step } from '../spa/stepRender.js';
import {createCanvas, setupChessboard} from './drawChessboard.js'
import { handleEvents } from './handleEvents.js'

export default class Chess extends Step {

	async render(appElement: HTMLElement): Promise<void> {
		sessionStorage.setItem("current-view", "Chess");
		if (!this.username) {
			this.username = await this.checkAuth();
		}
		try {

			const htmlContent = await fetch("../../html/chess/chess.html");
			if (!htmlContent.ok) {
				throw new Error("Failed to load the HTML file");
			}
			const htmlText = await htmlContent.text();
			appElement.innerHTML = htmlText;
			const board = document.getElementById("board") as HTMLDivElement;

			const canvas = createCanvas(board);
			setupChessboard(canvas);
			handleEvents(canvas);
		}
		catch (error) {
			console.log(error);
			appElement.innerHTML = `<div id="pong-container">An error occurred while generating the content</div>`;
		}
	}
}

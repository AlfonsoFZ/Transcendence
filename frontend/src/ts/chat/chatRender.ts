import { Step } from '../spa/stepRender.js';
import { verifySocket } from './verifySocket.js';
import { filterSearchUsers } from './filterSearch.js';
import { handleSocketEvents } from './handleSocketEvents.js';
import { handleContentStorage } from './handleContentStorage.js';
import { retrieveConnectedUsers, handleFormSubmit, handlePrivateMsg } from './handleSenders.js';

export default class Chat extends Step {

	async render(appElement: HTMLElement): Promise<void> {
		if (!this.username) {
			this.username = await this.checkAuth();
		}
		try {
				const htmlContent = await fetch("../../html/chat/chat.html");
				if (!htmlContent.ok) {
					throw new Error("Failed to load the HTML file");
				}
				const htmlText = await htmlContent.text();
				appElement.innerHTML = htmlText;
				const form = document.getElementById("chat-form") as HTMLFormElement;
				const textarea = document.getElementById("chat-textarea") as HTMLTextAreaElement;
				const chatMessages = document.getElementById("chat-messages") as HTMLDivElement;
				const items = document.getElementById("user-item-container") as HTMLDivElement;
				const searchInput = document.getElementById("search-users-input") as HTMLInputElement;

				handleContentStorage(chatMessages);
				Step.socket = verifySocket(Step.socket);
				handleSocketEvents(Step.socket!, chatMessages, this.username!);

				textarea.addEventListener('keydown', e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), form.requestSubmit()));
				form.addEventListener('submit', (e) => handleFormSubmit(e, textarea, Step.socket!));
				searchInput.addEventListener('keydown', e => e.key === 'Enter' && e.preventDefault());
                searchInput.addEventListener('input', () => filterSearchUsers(searchInput.value));
				items.addEventListener('dblclick', (e) => handlePrivateMsg(e, Step.socket!));
			}
		catch (error) {
				console.log("Error loading chat content:", error);
				appElement.innerHTML = `<div id="pong-container">An error occurred while generating the content</div>`;
			}
		}
}

// GESTIONAR EN EL BACKEND EL CASO DE QUE UN USUARIO SE DESCONECTE. ELIMINAR DEL ARRAY DE PRIVADOS.

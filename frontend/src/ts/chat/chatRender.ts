import { Step } from '../spa/stepRender.js';
import { verifySocket } from './verifySocket.js';
import { filterSearchUsers } from './filterSearch.js';
import { handleSocketEvents } from './handleSocketEvents.js';
import { handleContentStorage } from './handleContentStorage.js';
import { showUserOptionsMenu } from './handleUserOptionsMenu.js';
import { handleFormSubmit, handlePrivateMsg } from './handleSenders.js';

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

				handleContentStorage(chatMessages, this.username!);
				Step.socket = verifySocket(Step.socket);
				handleSocketEvents(Step.socket!, chatMessages, this.username!);

				textarea.addEventListener('keydown', e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), form.requestSubmit()));
				form.addEventListener('submit', (e) => handleFormSubmit(e, textarea, Step.socket!));
				searchInput.addEventListener('keydown', e => e.key === 'Enter' && e.preventDefault());
                searchInput.addEventListener('input', () => filterSearchUsers(searchInput.value));
				items.addEventListener('dblclick', (e) => handlePrivateMsg(e, Step.socket!));



				items.addEventListener("click", async (event) => {
					const target = event.target as HTMLElement;
					const userItem = target.closest(".item") as HTMLDivElement;
					if (!userItem) return;

					const usernameSpan = userItem.querySelector("span.text-sm");
					const clickedUsername = usernameSpan?.textContent?.trim();
					const userId = await getUserId(this.username!);
					console.log("Clicked user:", clickedUsername, "User ID:", userId);

					if (clickedUsername && clickedUsername !== this.username) {
						showUserOptionsMenu(userItem, event as MouseEvent, Step.socket!, userId);
					}
				});
			}
		catch (error) {
				console.log("Error loading chat content:", error);
				appElement.innerHTML = `<div id="pong-container">An error occurred while generating the content</div>`;
			}
		}
}

async function getUserId(username: string): Promise<string> {
    const response = await fetch(`https://localhost:8443/back/get_user_by_username/?username=${encodeURIComponent(username)}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("No se pudo obtener el userId para el username: " + username);
    }
    const data = await response.json();
    return data.id; // Ajusta si tu backend responde con otro campo
}
// GESTIONAR EN EL BACKEND EL CASO DE QUE UN USUARIO SE DESCONECTE. ELIMINAR DEL ARRAY DE PRIVADOS.

// Problema con la recarga de la página, se actualizan los contactos demasiadas veces y parpadea la foto, el hover y la luz del chat. Ver si se puede solucioanr.

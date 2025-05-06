import { Step } from './stepRender.js';

export default class Chat extends Step {
	async render(appElement: HTMLElement): Promise<void>  {
		console.log("Rendering chat page...");
		const menuContainer = document.getElementById("menu-container");
		try {
			const user = await this.checkAuth();
			if (user) {
				console.log("User authenticated filipine:", user);
				// Retornar el contenido para usuarios autenticados
				appElement.innerHTML = `
                   <div id="chat-container" class="flex flex-col items-center justify-center p-4">
                        <h1 class="text-4xl font-bold text-gray-800 mb-4">Chat</h1>
                        <div id="messages" class="h-64 w-full max-w-lg overflow-y-auto border border-gray-300 p-2 mb-4 bg-gray-100 rounded"></div>
                        <input id="chat-input" type="text" placeholder="Type a message..." class="border border-gray-300 p-2 w-full max-w-lg mb-2 rounded">
                        <button id="send-button" class="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
                    </div>
				`;
				console.log("Chat content rendered");
				this.setupWebSocket(user);
				} else {	
					// Retornar el contenido para usuarios no autenticados
					appElement.innerHTML =  `
						<div id="pong-container">
							<div class="paddle left-paddle"></div>
							<div class="ball"><img src="../img/bola.png" alt="Ball"></div>
							<div class="paddle right-paddle"></div>
						</div>
					`;
			}
		}
		catch (error) {
			appElement.innerHTML =  `<div id="pong-container">Ocurrió un error al generar el contenido</div>`;
		}
	}


	private setupWebSocket(clientId: string): void {
		const messagesContainer = document.getElementById("messages") as HTMLElement;
		const chatInput = document.getElementById("chat-input") as HTMLInputElement;
		const sendButton = document.getElementById("send-button") as HTMLButtonElement;
		console.log(`CLIENT: Setting up WebSocket connection...${clientId}`);
		// Conectar al servidor WebSocket
		const socket = new WebSocket(`https://localhost:8443/back/chat`);

		socket.onopen = () => {
			console.log("CLIENT: Connected to WebSocket server");
			const welcomeMessage = document.createElement("div");
			welcomeMessage.textContent = `Connected as ${clientId}`;
			messagesContainer.appendChild(welcomeMessage);
		};

		socket.onmessage = (event) => {
			const messageElement = document.createElement("div");
			messageElement.textContent = event.data;
			messagesContainer.appendChild(messageElement);
			messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll automático
		};

		socket.onclose = (event) => {
			console.log(`CLIENT: Connection closed - Code: ${event.code}, Reason: ${event.reason}`);
		};

		socket.onerror = (event) => {
			console.error("CLIENT: WebSocket error:", event);
		};

		sendButton.addEventListener("click", () => {
			const message = chatInput.value.trim();
			if (message && socket.readyState === WebSocket.OPEN) {
				const messageElement = document.createElement("div");
				messageElement.textContent = `You: ${message}`;
				messagesContainer.appendChild(messageElement);
				messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll automático
				// Enviar el mensaje al servidor
				socket.send(message);
				chatInput.value = ""; // Limpiar el campo de entrada
			}
		});

		chatInput.addEventListener("keypress", (event) => {
			if (event.key === "Enter") {
				sendButton.click();
			}
		});
	}
}
	


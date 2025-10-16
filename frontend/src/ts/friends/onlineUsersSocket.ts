import { GameConnection } from "../game/GameConnection.js";
import Game from "../game/Game.js";

export let onlineSocket: WebSocket | null = null;

export function initOnlineSocket() {
	if (!onlineSocket || onlineSocket.readyState === WebSocket.CLOSED) {
		onlineSocket = new WebSocket("wss://localhost:8443/back/ws/online");
		console.log("Online socket initialized");

		onlineSocket.onopen = () => {
			console.log("Online socket connection established");
		};

		onlineSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "onlineUsers") {
				console.log("Usuarios online recibidos:", data.users);
				sessionStorage.setItem("userConnected", JSON.stringify(data.users));
				window.dispatchEvent(new Event("onlineUsersUpdated"));
			}
			if (data.type === "refreshRelations") {
				console.log("Refresh relations event received");
				window.dispatchEvent(new Event("onlineUsersUpdated"));
			}
			if (data.type === "incomingChallenge") {
				console.log("incomingChallenge recibido:", data); // Log específico
				const fromName = data.from?.username || data.from?.id || "Opponent";
				showChallengeModal(fromName, data.requestId); // Usa el modal en lugar de alert/confirm
				return;
			}
			if (data.type === "gameStarted") {
				console.log("Evento gameStarted recibido:", data); // Log para confirmar recepción

				const gameId = data.gameId;
				const gameMode = data.gameMode;
				const token = data.token;

				console.log("Creando Game y GameConnection..."); // Log antes de crear
				const game = new Game();
				const gameConnection = new GameConnection(game);

				console.log("Llamando establishConnection..."); // Log antes de conectar
				gameConnection.establishConnection().then(() => {
					console.log("Conectado al WebSocket de juego, verificando estado..."); // Log en then

					if (gameConnection.socket && gameConnection.socket.readyState === WebSocket.OPEN) {
						const joinMsg = {
							type: 'JOIN_GAME',
							roomId: gameId,
							token: token
						};
						console.log("Enviando JOIN_GAME:", joinMsg); // Log antes de enviar
						gameConnection.socket.send(JSON.stringify(joinMsg));
						console.log("JOIN_GAME enviado manualmente con token");
					} else {
						console.error("WebSocket de juego no está OPEN. Estado:", gameConnection.socket?.readyState);
					}

					console.log("Game started with ID:", gameId, "Mode:", gameMode);

					// Añade listener para mensajes
					if (gameConnection.socket) {
						gameConnection.socket.addEventListener('message', (event) => {
							const msg = JSON.parse(event.data);
							console.log("Mensaje recibido del WebSocket de juego:", msg);
							if (msg.type === "GAME_INIT") {
								console.log("GAME_INIT recibido, debería navegar a la partida");
							}
						});
					}
				}).catch((error) => {
					console.error("Error en establishConnection:", error); // Log en catch
				});
    return;
}
		};

		onlineSocket.onclose = () => {
			console.log("Online socket closed");
			onlineSocket = null;
		};

		onlineSocket.onerror = (err) => {
			console.error("Error en el WebSocket de usuarios online:", err);
		};
	}
}

export function closeOnlineSocket() {
	if (onlineSocket) {
		onlineSocket.close();
		onlineSocket = null;
	}
}

function showChallengeModal(fromName: string, requestId: string) {
    // Crea el modal si no existe
    let modal = document.getElementById('challenge-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'challenge-modal';
        modal.className = 'challenge-modal'; // Usa clase para estilos
        modal.innerHTML = `
            <div class="modal-content">
                <p id="challenge-text"></p>
                <div class="modal-buttons">
                    <button id="accept-btn" class="btn-accept">Aceptar</button>
                    <button id="reject-btn" class="btn-reject">Rechazar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Añade estilos CSS dinámicamente (o mejor, agrégalo a tu CSS global)
        const style = document.createElement('style');
        style.textContent = `
            .challenge-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000; /* Alto z-index */
            }
            .modal-content {
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                text-align: center;
                max-width: 300px;
                width: 90%;
            }
            #challenge-text {
                margin-bottom: 20px;
                font-size: 16px;
                color: #333;
            }
            .modal-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            .btn-accept, .btn-reject {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            }
            .btn-accept {
                background: #4CAF50;
                color: white;
            }
            .btn-accept:hover {
                background: #45a049;
            }
            .btn-reject {
                background: #f44336;
                color: white;
            }
            .btn-reject:hover {
                background: #da190b;
            }
        `;
        document.head.appendChild(style);
    }

    // Actualiza el texto
    const text = document.getElementById('challenge-text');
    if (text) {
        text.textContent = `${fromName} te desafía a jugar. ¿Aceptar?`;
        console.log("Texto actualizado en modal:", text.textContent); // Log para verificar
    }

    // Maneja los botones
    const acceptBtn = document.getElementById('accept-btn');
    const rejectBtn = document.getElementById('reject-btn');
    if (acceptBtn && rejectBtn) {
        acceptBtn.onclick = () => {
            onlineSocket?.send(JSON.stringify({ type: "acceptChallenge", requestId }));
            modal.style.display = 'none';
        };
        rejectBtn.onclick = () => {
            onlineSocket?.send(JSON.stringify({ type: "rejectChallenge", requestId }));
            modal.style.display = 'none';
        };
    }

    // Muestra el modal
    modal.style.display = 'flex';
}

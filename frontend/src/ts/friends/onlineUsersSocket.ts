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

		onlineSocket.onmessage = async (event) => {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case "onlineUsers":
					console.log("Usuarios online recibidos:", data.users);
					sessionStorage.setItem("userConnected", JSON.stringify(data.users));
					window.dispatchEvent(new Event("onlineUsersUpdated"));
					break;
				case "refreshRelations":
					console.log("Refresh relations event received");
					window.dispatchEvent(new Event("onlineUsersUpdated"));
					break;
				case "incomingChallenge": {
					const { fromUsername, challengeId } = data;
					console.log("Incoming challenge received from:", fromUsername);
					showChallengeNotification(fromUsername, challengeId);
					break;
				}
				case "goToGame": {
					// backend envía: { type:'goToGame', roomId, gameMode, ... }
					const roomId: string = data.roomId;
					console.log("Navigating to game with ID:", roomId);

					const { SPA } = await import('../spa/spa.js');
					const spa = SPA.getInstance();

					// 1) navega a game-lobby (ruta válida en tu SPA)
					await spa.navigate('game-lobby');

					// 2) espera a que GameConnection esté conectado (WS de juego OPEN)
					await waitForGameReady();

					// 3) únete a la sala por el WS de juego
					spa.currentGame?.setOnlineId?.(roomId);
					spa.currentGame?.getGameConnection?.()?.joinGame?.(roomId);

					(window as any).showMessage?.('Uniéndose a la sala...', 'info');
					break;
				}
				// Fallback por si usas JOIN_GAME en vez de goToGame
				case "JOIN_GAME": {
					const roomId: string = data.roomId;
					const { SPA } = await import('../spa/spa.js');
					const spa = SPA.getInstance();
					await spa.navigate('game-lobby');
					await waitForGameReady();
					spa.currentGame?.setOnlineId?.(roomId);
					spa.currentGame?.getGameConnection?.()?.joinGame?.(roomId);
					(window as any).showMessage?.('Uniéndose a la sala...', 'info');
					break;
				}
				default:
					// noop
					break;
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

export function showChallengeNotification(fromUsername: string, challengeId: string) {
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
        text.textContent = `${fromUsername} te desafía a jugar. ¿Aceptar?`;
        console.log("Texto actualizado en modal:", text.textContent); // Log para verificar
    }

    // Maneja los botones
    const acceptBtn = document.getElementById('accept-btn');
    const rejectBtn = document.getElementById('reject-btn');
    if (acceptBtn && rejectBtn) {
        acceptBtn.onclick = () => {
            onlineSocket?.send(JSON.stringify({ type: "acceptChallenge", challengeId }));
            modal.style.display = 'none';
        };
        rejectBtn.onclick = () => {
            onlineSocket?.send(JSON.stringify({ type: "rejectChallenge", challengeId }));
            modal.style.display = 'none';
        };
    }

    // Muestra el modal
    modal.style.display = 'flex';
}

async function waitForGameReady(timeoutMs = 8000): Promise<void> {
    const { SPA } = await import('../spa/spa.js');
    const spa = SPA.getInstance();
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const tick = () => {
            const gc = spa.currentGame?.getGameConnection?.();
            if (gc?.socket && gc.socket.readyState === WebSocket.OPEN) return resolve();
            if (Date.now() - start > timeoutMs) return reject(new Error('timeout esperando WS de juego'));
            setTimeout(tick, 100);
        };
        tick();
    });
}

const playButton = document.getElementById("playButton");

async function WebsocketTest() {
	console.log("Button pushed");

	const socket = new WebSocket("https://localhost:8443/back/chat");

	socket.onopen = () => {
		console.log("CLIENT: Connected to Websocket-server");
		socket.send("Hi server!");
	};
	socket.onmessage = (event) => {
		console.log("CLIENT: Message from server:", event.data);
	};
	socket.onclose = (event: CloseEvent) => {
		console.log(`CLIENT: Connection closed - Code: ${event.code}, Reason: ${event.reason}`);
	};
	socket.onerror = (event) => {
		console.error("CLIENT: WebSocket error:", event);
	};	
}

document.addEventListener("DOMContentLoaded", () => {
    playButton?.addEventListener("click", async () => {
        await WebsocketTest();
    })
});


//Chat -> Crear un websocket para el chat
//onopen -> Envio de mensaje al servidor (Tipo registro)

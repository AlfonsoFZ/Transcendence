import { handleUserInfo } from "./handleUserInfo.js";
import { filterSearchUsers } from "./filterSearch.js";
import { inputKeyword, setHtmlUsersConnected } from "./state.js";
import { formatMsgTemplate, formatConnectedUsersTemplate, sortUsersAlphabetically } from "./formatContent.js";

function handleSocketOpen(socket: WebSocket) {
	socket.onopen = () => {
		const handshake = {
			type: 'handshake',
			message: ''
		};
		socket.send(JSON.stringify(handshake));
	}
}

function handleSocketMessage(socket: WebSocket, chatMessages: HTMLDivElement, name: string) {
	socket.onmessage = async (event: MessageEvent) => {
		const data = JSON.parse(event.data);
		let HtmlContent = "";
		let stored = "";
		if (data.type === 'message') {
			HtmlContent = await formatMsgTemplate(data, name);
			stored = sessionStorage.getItem("public-chat") || "";
			stored += HtmlContent;
			sessionStorage.setItem("public-chat", stored);
			if (sessionStorage.getItem("current-room") === "") {
				chatMessages.innerHTML = stored;
				chatMessages.scrollTop = chatMessages.scrollHeight;
			}
		}
		if (data.type === 'private') {
			if (!data.message) {
				handleUserInfo(chatMessages, data, name);
			}
			else {
				HtmlContent = await formatMsgTemplate(data, name);
				const privateChat = JSON.parse(sessionStorage.getItem("private-chat") || "{}");
				stored = privateChat[data.roomId] || "";
				stored += HtmlContent || "";
				privateChat[data.roomId] = stored || "";
				sessionStorage.setItem("private-chat", JSON.stringify(privateChat));
				if (sessionStorage.getItem("current-room") === data.roomId) {
					chatMessages.innerHTML = stored || "";
					chatMessages.scrollTop = chatMessages.scrollHeight;
				}
			}
		}
		if (data.type === 'connectedUsers') {
			HtmlContent = await formatConnectedUsersTemplate(data);
			HtmlContent = sortUsersAlphabetically(HtmlContent);
			setHtmlUsersConnected(HtmlContent);
			filterSearchUsers(inputKeyword);
		}
	}
}

function handleSocketClose(socket: WebSocket) {
	socket.onclose = (event: CloseEvent) => {
		console.log(`CLIENT: Connection closed - Code: ${event.code}`);
		// throw new Error("WebSocket connection closed unexpectedly.");
	}
}

function handleSocketError(socket: WebSocket) {
	socket.onerror = (event) => {
		console.error("CLIENT: WebSocket error:", event);
		// throw new Error("WebSocket error occurred.");
	}
}

export function handleSocketEvents(socket: WebSocket, chatMessages: HTMLDivElement, username: string): WebSocket {

	handleSocketOpen(socket);
	handleSocketMessage(socket, chatMessages, username);
	handleSocketClose(socket);
	handleSocketError(socket);
	return socket;
}

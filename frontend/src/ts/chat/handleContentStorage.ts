import { handleUserInfo } from "./handleUserInfo.js";

export function handleContentStorage(chatMessages: HTMLDivElement, recentChats: HTMLDivElement, username: string) {

	const chats = sessionStorage.getItem("recent-chats") || "";
	const currentRoom = sessionStorage.getItem("current-room") || "";
	const publicChat = sessionStorage.getItem("public-chat") || "";
	const data = JSON.parse(sessionStorage.getItem("JSONdata") || "{}");
 
	if (chats) {
		recentChats.innerHTML = chats;
	}
	if (!currentRoom && publicChat) {
		chatMessages.innerHTML = publicChat;
	}
	if (!currentRoom) {
		sessionStorage.setItem("current-room", "");
	}
	if (currentRoom) {
		handleUserInfo(chatMessages, data, username);
	}
	chatMessages.scrollTop = chatMessages.scrollHeight;
}


export function handleContentStorage(chatMessages: HTMLDivElement) {

	const currentRoom = sessionStorage.getItem("current-room") || "";
	const publicChat = sessionStorage.getItem("public-chat") || "";
	const privateChat: Record<string, string> = JSON.parse(sessionStorage.getItem("private-chat") || "{}");

	if (!currentRoom && publicChat) {
		chatMessages.innerHTML = publicChat;
	}
	if (!currentRoom) {
		sessionStorage.setItem("current-room", "");
	}
	if (currentRoom) {
		chatMessages.innerHTML = privateChat[currentRoom];
		// Need to add the user info.
	}
	chatMessages.scrollTop = chatMessages.scrollHeight;
}

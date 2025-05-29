export async function handleUserInfo(chatMessages: HTMLDivElement, data:any, name: string) {

	if (name === data.username) {
		sessionStorage.setItem("current-room", data.roomId);
		const htmlContent = await fetch("../../html/chat/userInfo.html");
		let htmlText = await htmlContent.text();
		htmlText = htmlText
			.replace("{{ username }}", data.partnerUsername.toString())
			.replace("{{ usernameImage }}", data.partnerUsername.toString())
			.replace("{{ imagePath }}", data.partnerImagePath.toString());
		const UserInfo = document.getElementById("user-info-container") as HTMLDivElement;
		UserInfo.innerHTML = htmlText;

		const privateChat = JSON.parse(sessionStorage.getItem("private-chat") || "{}") as Record<string, string>;
		const stored = privateChat[data.roomId] || "";
		chatMessages.innerHTML = stored || "";
		requestAnimationFrame(() => {
			chatMessages.scrollTop = chatMessages.scrollHeight;
		});

		const button = UserInfo.querySelector("#back-group-chat") as HTMLButtonElement;
		button.addEventListener('click', (e) => {
			e.preventDefault();
			sessionStorage.setItem("current-room", "");
			const stored = sessionStorage.getItem("public-chat") || "";
			UserInfo.innerHTML = "";
			chatMessages.innerHTML = stored;
			requestAnimationFrame(() => {
				chatMessages.scrollTop = chatMessages.scrollHeight;
			});
		});
	}
}


export async function formatMsgTemplate(data: any, name: string): Promise<string> {

	let htmlContent;
	if (data.username.toString() === name.toString()) {
		htmlContent = await fetch("../../html/chat/msgTemplateUser.html");
	}
	else {
		htmlContent = await fetch("../../html/chat/msgTemplatePartner.html");
	}
	let htmlText = await htmlContent.text();
	htmlText = htmlText
		.replace("{{ username }}", data.username.toString())
		.replace("{{ timeStamp }}", data.timeStamp.toString())
		.replace("{{ message }}", data.message.toString())
		.replace("{{ imagePath }}", data.imagePath.toString())
		.replace("{{ usernameImage }}", data.username.toString());
	return htmlText;
}

export async function formatConnectedUsersTemplate(data: any): Promise<string> {

	let htmlText = '';
	let htmlContent;
	let userHtmlContent;
	const usersConnected = Object.values(data.object) as { id: string; username: string; imagePath: string; status: string }[];

	for (const user of usersConnected) {
		userHtmlContent = await fetch("../../html/chat/userListItem.html");
		htmlContent = await userHtmlContent.text();
		htmlContent = htmlContent
			.replace("{{ id }}", user.id.toString())
			.replace("{{ username }}", user.username.toString())
			.replace("{{ usernameImage }}", user.username.toString())
			.replace("{{ imagePath }}", user.imagePath.toString())
			.replace("{{ bgcolor }}", user.status.toString())
			.replace("{{ bcolor }}", user.status.toString())
		htmlText += htmlContent;
	}
	return htmlText;
}

export function sortUsersAlphabetically(htmlContent: string): string {

	const container = document.createElement('div');
	container.innerHTML = htmlContent;
	const items = Array.from(container.querySelectorAll('.item'));

	items.sort((a, b) => {
		const usernameA = a.querySelector('span.text-sm')?.textContent?.trim().toLowerCase() || '';
		const usernameB = b.querySelector('span.text-sm')?.textContent?.trim().toLowerCase() || '';
		return usernameA.localeCompare(usernameB);
	});
	if (items.length > 0) {
		const target = items[0].querySelector('.item-wrapper');
		if (target) {
			target.classList.add("border-t");
		}
	}
	const sortedHtml = items.map(item => item.outerHTML).join('');
	return sortedHtml;
}

export async function formatUserInfo(data:any, name: string): Promise<string> {

	const usersConnected = JSON.parse(sessionStorage.getItem("JSONusers") || "{}");
	const user = usersConnected.object.find((user: any) => user.username === data.partnerUsername) || {};
	const color = user.status || "gray";
	sessionStorage.setItem("current-room", data.roomId);
	const htmlContent = await fetch("../../html/chat/userInfo.html");
	let htmlText = await htmlContent.text();
	htmlText = htmlText
		.replace("{{ username }}", data.partnerUsername.toString())
		.replace("{{ usernameImage }}", data.partnerUsername.toString())
		.replace("{{ imagePath }}", data.partnerImagePath.toString())
		.replace("{{ bgcolor }}", color)
		.replace("{{ bcolor }}", color)
		.replace("{{ gcolor }}", color);
	return htmlText;
}


export function retrieveConnectedUsers(socket: WebSocket) {

	const message = {
		type: 'status',
		message: ''
	};
	socket.send(JSON.stringify(message));
}

export function handleFormSubmit(e: SubmitEvent, textarea: HTMLTextAreaElement, socket: WebSocket) {
	
	e.preventDefault();
	let message = {};
	const currentRoom = sessionStorage.getItem("current-room") || "";
	const msg = textarea.value.trim();
	// const msg = textarea.value.replace(/^[ \t]+|[ \t]+$/g, '');
	
	if (msg) {
		if (!currentRoom) {
			message = {
				type: 'message',
				message: msg,
			};
		}
		else {
			message = {
				type: 'private',
				roomId: currentRoom,
				message: msg,
			}
		}
		socket.send(JSON.stringify(message));
		textarea.value = '';
	}
}

export function handlePrivateMsg(e:MouseEvent, socket:WebSocket) {

	const target = e.target as HTMLElement;
	const userDiv = target.closest('[data-id]') as HTMLElement | null;
	if (!userDiv)
		return;
	const id = userDiv.dataset.id;
	const message = {
		type: 'private',
		id: id,
	};
	socket.send(JSON.stringify(message));
}

export function retrieveConnectedUsers(socket) {
    const message = {
        type: 'status',
        message: ''
    };
    socket.send(JSON.stringify(message));
}
export function handleFormSubmit(e, textarea, socket) {
    e.preventDefault();
    let message = {};
    const currentRoom = sessionStorage.getItem("current-room") || "";
    // const msg = textarea.value;
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
            };
        }
        socket.send(JSON.stringify(message));
        textarea.value = '';
    }
}
export function handlePrivateMsg(e, socket) {
    const target = e.target;
    const userDiv = target.closest('[data-id]');
    if (!userDiv)
        return;
    const id = userDiv.dataset.id;
    const message = {
        type: 'private',
        id: id,
    };
    socket.send(JSON.stringify(message));
}

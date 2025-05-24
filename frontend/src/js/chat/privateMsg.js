export function openPrivate(e, items, username, socket) {
    const target = e.target;
    const userDiv = target.closest('[data-id]');
    if (!userDiv)
        return;
    const id = userDiv.dataset.id;
    console.log(id);
}

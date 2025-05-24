
export function openPrivate(e:MouseEvent, items:HTMLDivElement, username:string, socket:WebSocket):void {

	const target = e.target as HTMLElement;
	const userDiv = target.closest('[data-id]') as HTMLElement | null;
	if (!userDiv)
		return;

	const id = userDiv.dataset.id;
	console.log(id);

	
}

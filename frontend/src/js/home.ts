export function render() {
	    // Seleccionar los elementos del DOM
		const loginButton = document.getElementById("loginButton");
		const registerButton = document.getElementById("registerButton");
		const headerSeparator = document.getElementById("headerSeparator");
	
		// Remover la clase 'hidden' de los elementos
		loginButton?.classList.remove("hidden");
		registerButton?.classList.remove("hidden");
		headerSeparator?.classList.remove("hidden");
    return `<div></div>`;
}
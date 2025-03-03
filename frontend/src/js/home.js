export function render() {
    // Seleccionar los elementos del DOM
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    const headerSeparator = document.getElementById("headerSeparator");
    // Remover la clase 'hidden' de los elementos
    loginButton === null || loginButton === void 0 ? void 0 : loginButton.classList.remove("hidden");
    registerButton === null || registerButton === void 0 ? void 0 : registerButton.classList.remove("hidden");
    headerSeparator === null || headerSeparator === void 0 ? void 0 : headerSeparator.classList.remove("hidden");
    return `<div></div>`;
}

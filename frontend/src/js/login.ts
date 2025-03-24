const loginButton = document.getElementById("loginButton");
const loginContainer = document.getElementById("app-container");

async function handleLoginSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("https://localhost:8443/back/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error("Failed to send data");
        const result = await response.json();
        console.log("Data sent successfully:", result);
        if (loginContainer)
            loginContainer.innerHTML = "";

		// Almacenar el token de autenticación y el nombre de usuario
		localStorage.setItem('authToken', result.token);
		localStorage.setItem('username', result.username);

		// // Actualizar la UI
		// const spa = new SPA('app-container');
		// spa.updateUI();
    }
    catch (error) {
        console.error(error);
    }
}

async function render() {
    try {
        const response = await fetch("../html/login.html");
        if (!response.ok)
            throw new Error("Failed to load the HTML file");
        const htmlContent = await response.text();
        history.pushState(null, '', '/login');
        if (loginContainer) {
            loginContainer.innerHTML = htmlContent;
            const form = loginContainer.querySelector("form");
            form?.addEventListener("submit", handleLoginSubmit);
            const signUp = loginContainer.querySelector("#signUp");
            signUp?.addEventListener("click", async () => {
                await import('./register.js').then(module => module.render());
            });
            document.getElementById("loginButton")?.classList.add("hidden");
            document.getElementById("registerButton")?.classList.remove("hidden");
            document.getElementById("headerSeparator")?.classList.add("hidden");
        }
    }
    catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loginButton?.addEventListener("click", async () => {
        await render();
    });
});

export { render , handleLoginSubmit};
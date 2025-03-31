import { Step } from './stepRender.js';

export default class RegisterRender extends Step{
	async render(): Promise<string> {
		try {
			const response = await fetch("../html/register.html");
			if (!response.ok)
				throw new Error("Failed to load the HTML file");
			const htmlContent = await response.text();
			history.pushState(null, '', '/#register');

			requestAnimationFrame(async () => {
				const form = this.container.querySelector("form");
				if (form) {
					try {
						const { handleRegisterSubmit } = await import('./handleRegisterSubmit.js');
						form?.addEventListener("submit", async (event) => {
							event.preventDefault();
							// console.log("Se ha pulsado handleRegisterSubmit:", event);
							handleRegisterSubmit(event);
						});
					} catch (err) {
						console.error("Error al importar handleRegisterSubmit.js:", err);
					}
				}
			});
			return htmlContent;
		} catch (err) {
			console.error("Error in render method:", err);
			return `<div id="pong-container">Ocurrió un error al generar el contenido</div>`;
		}
	}
}
// const registerButton = document.getElementById("registerButton");
// const loginContainer = document.getElementById("app-container");

// export async function handleRegisterSubmit(event: SubmitEvent) {
//     event.preventDefault();
//     const form = event.target as HTMLFormElement;
//     const formData = new FormData(form);
//     const data = Object.fromEntries(formData.entries());

//     try {
//         const response = await fetch("https://localhost:8443/back/create_user", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//         });
//         if (!response.ok)
//             throw new Error("Failed to send data");
//         const result = await response.json();
//         console.log("Data sent successfully:", result);
//         if (loginContainer)
//             loginContainer.innerHTML = "";
//     }
//     catch (error) {
//         console.error(error);
//     }
// }

// export async function render() {
//     try {
//         const response = await fetch("../html/register.html");
//         if (!response.ok)
//             throw new Error("Failed to load the HTML file");
//         const htmlContent = await response.text();
//         history.pushState(null, '', '/register');
//         if (loginContainer) {
//             loginContainer.innerHTML = htmlContent;
//             const form = loginContainer.querySelector("form");
//             form?.addEventListener("submit", handleRegisterSubmit);
//             document.getElementById("registerButton")?.classList.add("hidden");
//             document.getElementById("loginButton")?.classList.remove("hidden");
//             document.getElementById("headerSeparator")?.classList.add("hidden");
//         }
//     }
//     catch (error) {
//         console.error(error);
//     }
// }

// document.addEventListener("DOMContentLoaded", () => {
//     registerButton?.addEventListener("click", async () => {
//         await render();
//     });
// });
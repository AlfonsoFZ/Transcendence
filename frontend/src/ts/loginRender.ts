import { Step } from './stepRender.js';

export default class LoginRender extends Step {

	async render(appElement: HTMLElement): Promise<void>  {
		console.log("En login render");
		try {
			const response = await fetch("../html/login.html");
			if (!response.ok) throw new Error("Failed to load the HTML file");
	
			const htmlContent = await response.text();
			if (this.container && htmlContent) {
				this.container.innerHTML = htmlContent;
	
				// Esperar un breve tiempo antes de asignar eventos
				requestAnimationFrame(async () => {
					const form = this.container.querySelector("form");
					if (form) {
						try {
							const { handleLoginSubmit } = await import('./handleLoginSubmit.js');
							form.addEventListener("submit", async (event) => {
								event.preventDefault();
								console.log("Se ha pulsado handleLoginSubmit:", event);
								handleLoginSubmit(event);
							});
						} catch (err) {
							console.error("Error al importar handleLoginSubmit.js:", err);
						}
					}
	
					// Configurar evento para el botón de registro
					// const signUp = this.container.querySelector("#signUp");
					// if (signUp) {
					// 	signUp.addEventListener("click", async () => {
					// 		try {
					// 			const { default: RegisterRender } = await import('./registerRender.js');
					// 			const registerInstance = new RegisterRender('app-container');
					// 			await registerInstance.render(appElement: HTMLElement);
					// 		} catch (err) {
					// 			console.error("Error al importar registerRender.js:", err);
					// 		}
					// 	});
					// }
				});
	
				appElement.innerHTML =  htmlContent;
			}
		} catch (error) {
			console.error("Error al renderizar la página de login:", error);
			appElement.innerHTML =  `<div id="pong-container">Ocurrió un error al generar el contenido</div>`;
		}
	}

	async renderHeader(headerElement: HTMLElement): Promise<void>  {
		headerElement.innerHTML = `
				<div id="authButtons" class="flex items-center">
					<a href="#register" class="text-white hover:text-gray-400 ml-2">Register</a>
				</div>
			`;
	}
}

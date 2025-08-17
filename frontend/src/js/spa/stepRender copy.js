var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SPA } from './spa.js';
export class Step {
    constructor(containerId) {
        this.username = null; // Almacena el nombre de usuario autenticado
        this.container = document.getElementById(containerId);
        this.spa = SPA.getInstance(); // Obtenemos la instancia de SPA
        this.initializeUsername();
    }
    initializeUsername() {
        return __awaiter(this, void 0, void 0, function* () {
            this.username = yield this.checkAuth();
        });
    }
    checkAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Verificando autenticación en checkAuth()...");
            const validation = false; // si está en false se está verificando la autenticación
            // Simulación de verificación de autenticación PARA CUANDO LA COOKIE NO SE ENVIA BIEN"
            if (validation) {
                const user = {
                    "username": "Pepe5@gmail.com",
                    "password": "1234",
                    "email": "Pepe5@gmail.com"
                };
                return user.username;
            }
            else {
                // console.log("Verificando autenticación...");
                try {
                    const response = yield fetch("https://localhost:8443/back/auth/verify-token", {
                        method: "GET",
                        credentials: "include"
                    });
                    if (!response.ok)
                        return null;
                    const data = yield response.json();
                    return data.user.username; // Devuelve el nombre de usuario si está autenticado
                }
                catch (error) {
                    console.error("Error al verificar la autenticación:", error);
                    return null;
                }
            }
        });
    }
    render(appElement) {
        return __awaiter(this, void 0, void 0, function* () {
            appElement.innerHTML = '<div>Contenido no definido</div>';
        });
    }
    renderHeader(headerElement) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.checkAuth();
                // console.log("Valor de user en renderHeader:", user);
                headerElement.innerHTML = user ?
                    `<div id="authButtons" class="flex items-center">
					<span id="username" class="text-white"><a href="#profile"> ${user} </a></span>
					<div id="headerSeparator" class="vertical-bar"></div>
					<a href="#logout" id="logoutButton" class="text-white hover:text-gray-400">Logout</a>
				</div>
			` : `
				<div id="authButtons" class="flex items-center">
					<a href="#login" class="text-white hover:text-gray-400">Login</a>
					<div id="headerSeparator" class="vertical-bar"></div>
					<a href="#register" class="text-white hover:text-gray-400 ml-2">Register</a>
				</div>
			`;
            }
            catch (error) {
                console.error("Error en renderHeader:", error);
                headerElement.innerHTML = `<div id="authButtons">Error al cargar el estado de autenticación</div>`;
            }
        });
    }
    /**º
     * Método para renderizar el menú de navegación si se está logueado
     * @param menuElement elemento HTML donde se renderiza el menú
     */
    renderMenu(menuElement) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.checkAuth();
            if (user) {
                // Modificar el innerHTML de menuContainer si el usuario está autenticado
                menuElement.innerHTML = `
	        <nav id="nav" class="bg-gray-800 p-4">
	            <ul class="flex space-x-4">
	                <li><a href="#game-lobby" class="text-white hover:text-gray-400">Play Game</a></li>
	                <li><a href="#tournament-lobby" class="text-white hover:text-gray-400">Tournaments</a></li>
	                <li><a href="#friends" class="text-white hover:text-gray-400">Friends</a></li>
	                <li><a href="#chat" class="text-white hover:text-gray-400">Chat</a></li>
	                <li><a href="#stats" class="text-white hover:text-gray-400">Stats</a></li>
	            </ul>
	        </nav>
    	`;
            }
            else {
                menuElement.innerHTML = '';
            }
        });
    }
    /**
     * Método para navegar a un paso especifico
     * @param step nombre del paso al que se quiere navegar
     */
    navigate(step) {
        var _a, _b;
        console.log('🎯 Step.navigate() called with step:', step, 'from:', (_b = (_a = new Error().stack) === null || _a === void 0 ? void 0 : _a.split('\n')[2]) === null || _b === void 0 ? void 0 : _b.trim());
        this.spa.navigate(step); // Usamos la instancia de SPA para navegar
    }
    /**
     *
     * @param headerElement botónes del header
     * @param menuElement barra de navegación
     * @param appElement contenido o cuerpo principal de la aplicación
     *
     */
    initChild(headerElement, menuElement, appElement) {
        return __awaiter(this, void 0, void 0, function* () {
            if (headerElement) {
                yield this.renderHeader(headerElement);
            }
            if (menuElement) {
                yield this.renderMenu(menuElement);
            }
            if (appElement) {
                yield this.render(appElement);
            }
        });
    }
    /**
     * Método para inicializar el paso se asegura que existen los elementos header, menu y app
     * para poder renderizar el contenido correspondiente en cada slot o "placeholder"
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let headerElement = document.getElementById('header-buttons');
            let menuElement = document.getElementById('menu-container');
            let appElement = document.getElementById('app-container');
            while (!headerElement || !menuElement || !appElement) {
                yield new Promise(resolve => setTimeout(resolve, 100)); // Esperar 100ms antes de volver a comprobar
                headerElement = document.getElementById('header-buttons');
                menuElement = document.getElementById('menu-container');
                appElement = document.getElementById('app-container');
            }
            this.initChild(headerElement, menuElement, appElement);
        });
    }
}
Step.socket = null; // Almacena la conexión WebSocket

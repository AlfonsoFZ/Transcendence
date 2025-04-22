/**
 * UserStatus
 * 0 - No friends - addfriend
 * 1 - Friends - removefriend
 * 2 - Pending request - cancel request
 * 3 - Request sent - accept request
 * 4 - Request received - go to request list
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Friends list action buttons
 * 1 - Friends - removefriend
 * 2 - Block - unblock
 */
export class SearchItem {
    constructor(containerId, user, userStatus) {
        this.user = null; // Almacena el id y nombre de usuario autenticado
        this.container = document.getElementById(containerId);
        this.user = user;
        this.userStatus = userStatus; // Inicializa el estado de usuarios
        this.init();
    }
    render(appElement) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("../html/search_item.html");
                if (!response.ok)
                    throw new Error("Failed to load the HTML file");
                let htmlContent = yield response.text();
                htmlContent = htmlContent;
                console.log("userStatus:", this.userStatus);
                if (this.userStatus == 0) {
                    htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="addFriendButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Friend</button>`);
                }
                else if (this.userStatus == 1) {
                    htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="removeFriendButton" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Remove Friend</button>`);
                }
                else if (this.userStatus == 2) {
                    htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="cancelRequestButton" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Cancel Request</button>`);
                }
                else if (this.userStatus == 3) {
                    htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="acceptRequestButton" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Accept Request</button>`);
                }
                else if (this.userStatus == 4) {
                    htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="declineRequestButton" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Decline Request</button>`);
                }
                else {
                    htmlContent = htmlContent.replace("{{ search_item_btn }}", `<button id="addFriendButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Friend</button>`);
                }
                if (this.user && this.user[0])
                    htmlContent = htmlContent.replace("{{ id }}", this.user[0]);
                if (this.user && this.user[1])
                    htmlContent = htmlContent.replace("{{ username }}", this.user[1]);
                console.log("htmlcontent: " + htmlContent);
                this.container.innerHTML += htmlContent;
            }
            catch (error) {
                console.error("Error al renderizar el elemento SearchItem:", error);
                this.container.innerHTML = '<div>Error retrieving user</div>';
            }
        });
    }
    /**
         *
         * @param appElement html al que se añadirá el componente
         *
         */
    initChild(appElement) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let appElement = this.container;
            while (!appElement) {
                yield new Promise(resolve => setTimeout(resolve, 100)); // Esperar 100ms antes de volver a comprobar
                appElement = this.container;
            }
            this.initChild(appElement);
        });
    }
}

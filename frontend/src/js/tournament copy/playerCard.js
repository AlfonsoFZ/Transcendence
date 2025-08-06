var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class PlayerCard {
    constructor(playerIndex, templatePath, scriptHandler) {
        this.player_index = playerIndex;
        this.templatePath = "../html/PlayerCard.html";
        this.scriptHandler = scriptHandler;
    }
    render(target_1) {
        return __awaiter(this, arguments, void 0, function* (target, placeholders = {}) {
            const html = yield this.loadTemplate();
            const parsed = html.replace(/\{\{player_index\}\}/g, this.player_index.toString());
            //   const parsed = this.replacePlaceholders(html, placeholders);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = parsed;
            this.el = wrapper.firstElementChild;
            target.appendChild(this.el);
            if (this.scriptHandler)
                this.scriptHandler();
        });
    }
    loadTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.templatePath);
            return yield response.text();
        });
    }
}

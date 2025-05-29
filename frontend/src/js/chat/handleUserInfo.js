var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function handleUserInfo(chatMessages, data, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (name === data.username) {
            sessionStorage.setItem("current-room", data.roomId);
            const htmlContent = yield fetch("../../html/chat/userInfo.html");
            let htmlText = yield htmlContent.text();
            htmlText = htmlText
                .replace("{{ username }}", data.partnerUsername.toString())
                .replace("{{ usernameImage }}", data.partnerUsername.toString())
                .replace("{{ imagePath }}", data.partnerImagePath.toString());
            const UserInfo = document.getElementById("user-info-container");
            UserInfo.innerHTML = htmlText;
            const privateChat = JSON.parse(sessionStorage.getItem("private-chat") || "{}");
            const stored = privateChat[data.roomId] || "";
            chatMessages.innerHTML = stored || "";
            requestAnimationFrame(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
            const button = UserInfo.querySelector("#back-group-chat");
            button.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.setItem("current-room", "");
                const stored = sessionStorage.getItem("public-chat") || "";
                UserInfo.innerHTML = "";
                chatMessages.innerHTML = stored;
                requestAnimationFrame(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                });
            });
        }
    });
}

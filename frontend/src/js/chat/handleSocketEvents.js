var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { handleUserInfo } from "./handleUserInfo.js";
import { filterSearchUsers } from "./filterSearch.js";
import { inputKeyword, setHtmlUsersConnected } from "./state.js";
import { formatMsgTemplate, formatConnectedUsersTemplate, sortUsersAlphabetically } from "./formatContent.js";
function handleSocketOpen(socket) {
    socket.onopen = () => {
        const handshake = {
            type: 'handshake',
            message: ''
        };
        socket.send(JSON.stringify(handshake));
    };
}
function handleSocketMessage(socket, chatMessages, name) {
    socket.onmessage = (event) => __awaiter(this, void 0, void 0, function* () {
        const data = JSON.parse(event.data);
        let HtmlContent = "";
        let stored = "";
        if (data.type === 'message') {
            HtmlContent = yield formatMsgTemplate(data, name);
            stored = sessionStorage.getItem("public-chat") || "";
            stored += HtmlContent;
            sessionStorage.setItem("public-chat", stored);
            if (sessionStorage.getItem("current-room") === "") {
                chatMessages.innerHTML = stored;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
        if (data.type === 'private') {
            if (!data.message) {
                handleUserInfo(chatMessages, data, name);
            }
            else {
                HtmlContent = yield formatMsgTemplate(data, name);
                const privateChat = JSON.parse(sessionStorage.getItem("private-chat") || "{}");
                stored = privateChat[data.roomId] || "";
                stored += HtmlContent || "";
                privateChat[data.roomId] = stored || "";
                sessionStorage.setItem("private-chat", JSON.stringify(privateChat));
                if (sessionStorage.getItem("current-room") === data.roomId) {
                    chatMessages.innerHTML = stored || "";
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }
        }
        if (data.type === 'connectedUsers') {
            HtmlContent = yield formatConnectedUsersTemplate(data);
            HtmlContent = sortUsersAlphabetically(HtmlContent);
            setHtmlUsersConnected(HtmlContent);
            filterSearchUsers(inputKeyword);
        }
    });
}
function handleSocketClose(socket) {
    socket.onclose = (event) => {
        console.log(`CLIENT: Connection closed - Code: ${event.code}`);
        // throw new Error("WebSocket connection closed unexpectedly.");
    };
}
function handleSocketError(socket) {
    socket.onerror = (event) => {
        console.error("CLIENT: WebSocket error:", event);
        // throw new Error("WebSocket error occurred.");
    };
}
export function handleSocketEvents(socket, chatMessages, username) {
    handleSocketOpen(socket);
    handleSocketMessage(socket, chatMessages, username);
    handleSocketClose(socket);
    handleSocketError(socket);
    return socket;
}

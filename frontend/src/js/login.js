"use strict";
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const loginContainer = document.getElementById("loginContainer");
async function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.target;
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
    }
    catch (error) {
        console.error(error);
    }
}
async function handleRegisterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch("https://localhost:8443/back/create_user", {
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
    }
    catch (error) {
        console.error(error);
    }
}
async function loadRegisterHtml() {
    var _a, _b, _c;
    try {
        const response = await fetch("../html/register.html");
        if (!response.ok)
            throw new Error("Failed to load the HTML file");
        const htmlContent = await response.text();
        history.pushState(null, '', '/register');
        if (loginContainer) {
            loginContainer.innerHTML = htmlContent;
            const form = loginContainer.querySelector("form");
            form === null || form === void 0 ? void 0 : form.addEventListener("submit", handleRegisterSubmit);
            (_a = document.getElementById("registerButton")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            (_b = document.getElementById("loginButton")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
            (_c = document.getElementById("headerSeparator")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
        }
    }
    catch (error) {
        console.error(error);
    }
}
async function loadLoginHtml() {
    var _a, _b, _c;
    try {
        const response = await fetch("../html/login.html");
        if (!response.ok)
            throw new Error("Failed to load the HTML file");
        const htmlContent = await response.text();
        history.pushState(null, '', '/login');
        if (loginContainer) {
            loginContainer.innerHTML = htmlContent;
            const form = loginContainer.querySelector("form");
            form === null || form === void 0 ? void 0 : form.addEventListener("submit", handleLoginSubmit);
            const signUp = loginContainer.querySelector("#signUp");
            signUp === null || signUp === void 0 ? void 0 : signUp.addEventListener("click", async () => {
                await loadRegisterHtml();
            });
            (_a = document.getElementById("loginButton")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            (_b = document.getElementById("registerButton")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
            (_c = document.getElementById("headerSeparator")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
        }
    }
    catch (error) {
        console.error(error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener("click", async () => {
        await loadLoginHtml();
    });
    registerButton === null || registerButton === void 0 ? void 0 : registerButton.addEventListener("click", async () => {
        await loadRegisterHtml();
    });
});

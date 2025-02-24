"use strict";
const loginButton = document.getElementById("loginButton");
const loginContainer = document.getElementById("loginContainer");
async function handleCredentialResponse(response) {
    try {
        const idToken = response.credential;
        const res = await fetch("https://localhost:8443/back/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_token: idToken }),
        });
        if (!res.ok)
            throw new Error("Failed to send data");
        const result = await res.json();
        console.log("Data sent successfully:", result);
    }
    catch (error) {
        console.error(error);
    }
}
function renderGoogleButton() {
    google.accounts.id.initialize({
        // ISM: Need to import GOOGLE_CLIENT_ID from .env
        client_id: "882460456768-6o81p8qqq1m8a4gajmp8ps4h70mghcbj.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(document.getElementById("googleLoginButton"), {
        theme: "outline",
        size: "large",
        locale: "en"
    });
}
function appendGoogleScriptDom() {
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]'))
        return;
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => renderGoogleButton();
    document.body.appendChild(script);
}
async function loadLoginHtml() {
    if (loginContainer === null || loginContainer === void 0 ? void 0 : loginContainer.querySelector("form"))
        return;
    try {
        const response = await fetch("../html/login.html");
        if (!response.ok)
            throw new Error("Failed to load the HTML file");
        const htmlContent = await response.text();
        if (loginContainer) {
            loginContainer.innerHTML = htmlContent;
            appendGoogleScriptDom();
            const form = loginContainer.querySelector("form");
            if (form)
                form.addEventListener("submit", handleSubmit);
        }
    }
    catch (error) {
        console.error(error);
    }
}
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch("https://localhost:8443/back/api/data", {
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
    }
    catch (error) {
        console.error(error);
    }
}
loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener("click", async () => {
    await loadLoginHtml();
});

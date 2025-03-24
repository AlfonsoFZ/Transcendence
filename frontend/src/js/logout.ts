const logoutButton = document.getElementById("logoutButton");
const loginContainer = document.getElementById("app-container");


async function handleLogoutSubmit(event: SubmitEvent) {
    event.preventDefault();
	console.error("ESe ha lanzado handleLogoutSubmit");

//     try {
//         const response = await fetch("https://localhost:8443/back/auth/logout", {
//             method: "POST",
//             credentials: "include",
//         });

//         if (!response.ok) throw new Error("Failed to log out");

//         console.log("User logged out successfully1.");

//         // Eliminar datos de autenticación del almacenamiento local y cookies
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("username");
//         document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

//         // Redirigir a la página principal
//         window.location.hash = "#home";
//     } catch (error) {
//         console.error("Error during logout:", error);
//     }
// }
}

async function render() {
    try {
        const response = await fetch("https://localhost:8443/back/auth/logout", {
            method: "POST",
            credentials: "include",
        });
		console.error("REsponse Se ha lanzado render");
		console.log (response)
        if (!response.ok) throw new Error("Failed to log out");

        console.log("User logged out successfully2.");

        // Eliminar datos de autenticación del almacenamiento local y cookies
        // localStorage.removeItem("authToken");
        // localStorage.removeItem("username");
        // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirigir a la página principal
        window.location.hash = "#home";
    } catch (error) {
        console.error("Error during logout:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    logoutButton?.addEventListener("click", async () => {
        await render();
    });
});

export { render, handleLogoutSubmit };
























































// const logoutButton = document.getElementById("logoutButton");
// const loginContainer = document.getElementById("app-container");

// async function handleLogoutSubmit(event: SubmitEvent) {
//     event.preventDefault();
//     const form = event.target as HTMLFormElement;
//     const formData = new FormData(form);
//     const data = Object.fromEntries(formData.entries());

//     try {
//         const response = await fetch("https://localhost:8443/back/auth/logout", {
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

// 		// Almacenar el token de autenticación y el nombre de usuario
// 		localStorage.setItem('authToken', result.token);
// 		localStorage.setItem('username', result.username);

// 		// Actualizar la UI
// 		// const spa = new SPA('app-container');
// 		// spa.updateUI();
//     }
//     catch (error) {
//         console.error(error);
//     }
// }

// async function render() {

// 		// Eliminar la cookie de inicio de sesión
// 	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
// 	console.log(document.cookie);
// 	if (loginContainer) {
// 		loginContainer.innerHTML = "<p>You have been logged out.</p>";
// 	}
// 	console.log("User logged out successfully.");
// // }
//     // try {
//     //     const response = await fetch("../html/login.html");
//     //     if (!response.ok)
//     //         throw new Error("Failed to load the HTML file");
//     //     const htmlContent = await response.text();
//     //     history.pushState(null, '', '/login');
//     //     if (loginContainer) {
//     //         loginContainer.innerHTML = htmlContent;
//     //         const form = loginContainer.querySelector("form");
//     //         form?.addEventListener("submit", handleLoginSubmit);
//     //         const signUp = loginContainer.querySelector("#signUp");
//     //         signUp?.addEventListener("click", async () => {
//     //             await import('./register.js').then(module => module.render());
//     //         });
//     //         document.getElementById("loginButton")?.classList.add("hidden");
//     //         document.getElementById("registerButton")?.classList.remove("hidden");
//     //         document.getElementById("headerSeparator")?.classList.add("hidden");
//     //     }
//     // }
//     // catch (error) {
//     //     console.error(error);
//     // }
// }

// document.addEventListener("DOMContentLoaded", () => {
//     logoutButton?.addEventListener("click", async () => {
//         await render();
//     });
// });

// export { render , handleLogoutSubmit };

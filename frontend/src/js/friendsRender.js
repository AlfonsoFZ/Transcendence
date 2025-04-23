var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Step } from './stepRender.js';
import { SearchItem } from './friends_search_Item.js';
export default class Friends extends Step {
    render(appElement) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("En Friend render");
            if (!this.username) {
                this.username = yield this.checkAuth();
            }
            try {
                const response = yield fetch("../html/friends.html");
                if (!response.ok)
                    throw new Error("Failed to load the HTML file");
                let htmlContent = yield response.text();
                appElement.innerHTML = htmlContent;
                const searchTableTemplate = yield fetch("../html/search_table.html");
                if (!searchTableTemplate.ok)
                    throw new Error("Failed to load the HTML file");
                else {
                    const searchMainContainer = document.getElementById("search-main-container");
                    let searchTableContent = yield searchTableTemplate.text();
                    if (searchMainContainer && searchTableContent) {
                        searchMainContainer.innerHTML += searchTableContent;
                    }
                    // htmlContent = htmlContent
                    // 	.replace("{{ totalGames }}", userStats.totalGames.toString())
                    // 	.replace("{{ wins }}", userStats.wins.toString())
                    // 	.replace("{{ losses }}", userStats.losses.toString())
                    // 	.replace("{{ timePlayed }}", userStats.timePlayed.toString())
                    // 	.replace("{{ tournamentsPlayed }}", userStats.tournamentsPlayed.toString())
                    // 	.replace("{{ tournamentsWon }}", userStats.tournamentsWon.toString());
                    const searchItem = new SearchItem('search_results', ["123", "Pepe"], 0);
                    const searchItem1 = new SearchItem('search_results', ["1234", "Pepe2"], 1);
                    const searchItem2 = new SearchItem('search_results', ["1235", "Pepe3"], 2);
                    const searchItem3 = new SearchItem('search_results', ["1236", "Pepe4"], 3);
                    const searchItem4 = new SearchItem('search_results', ["1237", "Pepe5"], 4);
                }
                // handleStats(userStats);
            }
            catch (error) {
                console.error("Error loading HTML file:", error);
                appElement.innerHTML = `<div id="pong-container">An error occurred while generating the content</div>`;
            }
            // 	try{
            // 		const url = `https://localhost:8443/back/get_user_gamelogs`;
            // 		const getUserResponse = await fetch(`${url}`, {
            // 			method: "GET",
            // 			credentials: "include"
            // 		});
            // 		if (!getUserResponse.ok) {
            // 			throw new Error("Error retrieving stats");
            // 		}
            // 		const userStats = await getUserResponse.json();
            // 		console.log("userStats:", userStats);
            // 		if (userStats) {
            // 			try{
            // 			const response = await fetch("../html/stats.html");
            // 			if (!response.ok) throw new Error("Failed to load the HTML file");
            // 			let htmlContent = await response.text();
            // 			htmlContent = htmlContent
            // 				.replace("{{ totalGames }}", userStats.totalGames.toString())
            // 				.replace("{{ wins }}", userStats.wins.toString())
            // 				.replace("{{ losses }}", userStats.losses.toString())
            // 				.replace("{{ timePlayed }}", userStats.timePlayed.toString())
            // 				.replace("{{ tournamentsPlayed }}", userStats.tournamentsPlayed.toString())
            // 				.replace("{{ tournamentsWon }}", userStats.tournamentsWon.toString());
            // 			appElement.innerHTML =  htmlContent;
            // 			handleStats(userStats);
            // 			}catch (error) {
            // 				console.error("Error loading HTML file:", error);
            // 				appElement.innerHTML =  `<div id="pong-container">An error occurred while generating the content</div>`;
            // 			}
            // 		}
            // 	} catch (error) {
            // 		console.error("Error rendering Stats element:", error);
            // 		appElement.innerHTML =  `<div id="pong-container">An error occurred while generating the content</div>`;
            // 	}
        });
    }
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { handleStats, handleChessStats } from './handleStats.js';
function formatTimeFromMilliseconds(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    // Formato h:mm:ss (sin ceros a la izquierda en horas)
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
export function getPongStats(appElement) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("getPongStats called");
        try {
            const url = `https://localhost:8443/back/get_user_gamelogs`;
            const getUserResponse = yield fetch(`${url}`, {
                method: "GET",
                credentials: "include"
            });
            if (!getUserResponse.ok) {
                throw new Error("Error retrieving stats");
            }
            const userStats = yield getUserResponse.json();
            console.log("userStats:", userStats);
            if (userStats) {
                try {
                    const statsContainer = document.getElementById("pong-stats-content");
                    const selectionElement = document.getElementById("stats_select");
                    // const selectedValue = (selectionElement as HTMLSelectElement).value;
                    let htmlContent = statsContainer ? statsContainer.innerHTML : '';
                    // console.log("htmlContent before:", htmlContent);
                    // console.log("selectedValue:", selectedValue);
                    if (statsContainer) {
                        statsContainer.innerHTML = ''; // Clear previous content			
                        // const response = await fetch("../../html/stats/stats.html");
                        // if (!response.ok) throw new Error("Failed to load the HTML file");
                        // let htmlContent = await response.text();
                        htmlContent = htmlContent
                            .replace("{{ totalGames }}", userStats.totalGames.toString())
                            .replace("{{ wins }}", userStats.wins.toString())
                            .replace("{{ losses }}", userStats.losses.toString())
                            .replace("{{ timePlayed }}", (formatTimeFromMilliseconds(userStats.timePlayed)).toString())
                            .replace("{{ tournamentsGames }}", userStats.tournamentsPlayed.toString())
                            .replace("{{ winsInTournaments }}", userStats.winsInTournaments.toString())
                            .replace("{{ lossesInTournaments }}", userStats.losses.toString());
                        statsContainer.innerHTML = htmlContent;
                        // console.log("htmlContent:", htmlContent);
                        handleStats(userStats);
                    }
                }
                catch (error) {
                    console.error("Error loading HTML file:", error);
                    appElement.innerHTML = `<div id="pong-container">An error occurred while generating the content</div>`;
                }
            }
        }
        catch (error) {
            console.error("Error rendering Stats element:", error);
            appElement.innerHTML = `<div id="pong-container">An error occurred while generating the content</div>`;
        }
    });
}
export function getPongTournamentStats(appElement) {
    return __awaiter(this, void 0, void 0, function* () {
        alert("getPongTournamentStats called");
    });
}
export function getChessStats(appElement) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("getChessStats called");
        try {
            const url = `https://localhost:8443/back/get_user_chessgamelogs`;
            const getUserResponse = yield fetch(`${url}`, {
                method: "GET",
                credentials: "include"
            });
            if (!getUserResponse.ok) {
                throw new Error("Error retrieving stats");
            }
            const userStats = yield getUserResponse.json();
            console.log("userStats:", userStats);
            if (userStats) {
                try {
                    const statsContainer = document.getElementById("chess-stats-content");
                    const selectionElement = document.getElementById("stats_select");
                    // const selectedValue = (selectionElement as HTMLSelectElement).value;
                    let htmlContent = statsContainer ? statsContainer.innerHTML : '';
                    // console.log("htmlContent before:", htmlContent);
                    // console.log("selectedValue:", selectedValue);
                    if (statsContainer) {
                        statsContainer.innerHTML = ''; // Clear previous content			
                        // const response = await fetch("../../html/stats/stats.html");
                        // if (!response.ok) throw new Error("Failed to load the HTML file");
                        // let htmlContent = await response.text();
                        htmlContent = htmlContent
                            .replace("{{ totalGames }}", userStats.totalGames.toString())
                            .replace("{{ wins }}", userStats.wins.toString())
                            .replace("{{ losses }}", userStats.losses.toString())
                            .replace("{{ draws }}", userStats.draws.toString())
                            .replace("{{ WinsByCheckMate }}", userStats.WinsByCheckMate.toString())
                            .replace("{{ lostByCheckMate }}", userStats.losses.toString());
                        statsContainer.innerHTML = htmlContent;
                        // console.log("htmlContent:", htmlContent);
                        handleChessStats(userStats);
                    }
                }
                catch (error) {
                    console.error("Error loading HTML file:", error);
                    appElement.innerHTML = `<div id="pong-container">An error occurred while generating the content</div>`;
                }
            }
        }
        catch (error) {
            console.error("Error rendering Stats element:", error);
            appElement.innerHTML = `<div id="pong-container">An error occurred while generating the content</div>`;
        }
    });
}

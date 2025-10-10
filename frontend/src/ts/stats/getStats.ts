import { handleStats, handleChessStats } from './handleStats.js';

function formatTimeFromMilliseconds(milliseconds: number): string {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	
	// Formato h:mm:ss (sin ceros a la izquierda en horas)
	return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export async function getPongStats(appElement: HTMLElement): Promise<any> {
			console.log("getPongStats called");
			try{
			const url = `https://localhost:8443/back/get_user_gamelogs`;
			const getUserResponse = await fetch(`${url}`, {
				method: "GET",
				credentials: "include"
			});

			if (!getUserResponse.ok) {
				throw new Error("Error retrieving stats");
			}
			const userStats = await getUserResponse.json();
			console.log("userStats:", userStats);
			if (userStats) {
				try{
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
					statsContainer.innerHTML =  htmlContent;
					// console.log("htmlContent:", htmlContent);
					handleStats(userStats);
					}
				}catch (error) {
					console.error("Error loading HTML file:", error);
					appElement.innerHTML =  `<div id="pong-container">An error occurred while generating the content</div>`;
				}
			}
		} catch (error) {
			console.error("Error rendering Stats element:", error);
			appElement.innerHTML =  `<div id="pong-container">An error occurred while generating the content</div>`;
		}
}

export async function getPongTournamentStats(appElement: HTMLElement): Promise<any> {
	alert("getPongTournamentStats called");
}

export async function getChessStats(appElement: HTMLElement): Promise<any> {
	console.log("getChessStats called");
		try{
		const url = `https://localhost:8443/back/get_user_chessgamelogs`;

		const getUserResponse = await fetch(`${url}`, {
			method: "GET",
			credentials: "include"
		});

		if (!getUserResponse.ok) {
			throw new Error("Error retrieving stats");
		}
		const userStats = await getUserResponse.json();
		console.log("userStats:", userStats);
		if (userStats) {
			try{
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
				statsContainer.innerHTML =  htmlContent;
				// console.log("htmlContent:", htmlContent);
				handleChessStats(userStats);
				}
			}catch (error) {
				console.error("Error loading HTML file:", error);
				appElement.innerHTML =  `<div id="pong-container">An error occurred while generating the content</div>`;
			}
		}
		} catch (error) {
			console.error("Error rendering Stats element:", error);
			appElement.innerHTML =  `<div id="pong-container">An error occurred while generating the content</div>`;
		}
}
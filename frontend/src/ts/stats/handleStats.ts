declare var Chart: any;
let userID: string;
let userNames: Map<string, string> = new Map();

function formatTimeFromMilliseconds(milliseconds: number): string {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	
	// Formato h:mm:ss (sin ceros a la izquierda en horas)
	return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function fetchUsers(): Promise<any> {
	try {
		const response = await fetch('https://localhost:8443/back/get_users', {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to fetch users: ${error.message}`);
		} else {
			throw new Error("Failed to fetch users logs: Unknown error");
		}
	}
}

export async function fetchGameLogs(): Promise<any> {
	try {
		const response = await fetch('https://localhost:8443/back/get_gamelogs', {
			method: "GET",
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to fetch game logs: ${error.message}`);
		} else {
			throw new Error("Failed to fetch game logs: Unknown error");
		}
	}
}

export async function fetchChessGameLogs(): Promise<any> {
	try {

				const url = `https://localhost:8443/back/get_chessgamelogs`;
		const getUserResponse = await fetch(`${url}`, {
			method: "GET",
			credentials: "include"
		});

		if (!getUserResponse.ok) {
			throw new Error("Error retrieving stats");
		}
		const userStats = await getUserResponse.json();
		console.log("userStats:", userStats);
		return await userStats;
		// const response = await fetch('https://localhost:8443/back/get_user_chessgamelogs`', {			
		// 	method: "GET",
		// 	credentials: "include"
		// });
		// if (!response.ok) {
		// 	throw new Error(`HTTP error! status: ${response.status}`);
		// }
		// return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to fetch game logs: ${error.message}`);
		} else {
			throw new Error("Failed to fetch game logs: Unknown error");
		}
	}
}

export async function initializeUserNames(): Promise<void> {
	try {
		const users = await fetchUsers();
		users.forEach((user: { id: string; username: string }) => {
			userNames.set(user.id, user.username);
		});
	} catch (error) {
		console.error("Error initializing user names:", error);
	}
}

export function getUserNameById(userId: string| null): string | undefined {
	console.log("userId", userId);
	if (userId == "-1")
		return "AI";
	if (userId == "-2")
		return "Guest";
	if (!userId)
		return " -- ";
	const username = userNames.get(userId);
	return username;
}

export async function handleStats(userStats: { userId: string; wins: number; losses: number; totalGames: number, tournamentsPlayed: number, winsInTournaments: number }): Promise<void> {
	userID = userStats.userId;
	initializeUserNames();
	// De esta forma hacemos que se ejectue el script de Chart.js
	if (typeof Chart === 'undefined') {
		await loadChartJs();
	}
	// Asignamos el canvas a la variable
	const canvas = document.getElementById('statsChart') as HTMLCanvasElement | null;
	if (!canvas) {
		console.error("Canvas element with id 'statsChart' not found.");
		return;
	}
	// Asignamos el canvas a la variable
	const canvas2 = document.getElementById('statsTournamentChart') as HTMLCanvasElement | null;
	if (!canvas2) {
		console.error("Tournament Canvas element with id 'statsChart' not found.");
		return;
	}
	// generamos el contexto 2D del canvas
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error("Failed to get 2D context from canvas.");
		return;
	}
	// generamos el contexto 2D del canvas
	const ctx2 = canvas2.getContext('2d');
	if (!ctx2) {
		console.error("Failed to get 2D context from canvas.");
		return;
	}

	const statsChart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: ['Wins', 'Losses', 'Total'],
			datasets: [{
				data: [userStats.wins, userStats.losses, userStats.totalGames],
				backgroundColor: ['#ffe90d', '#bc3112', '#feab39'], 
				borderColor: '#1F2937',
				borderWidth: 2
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					labels: {
						color: 'white'
					}
				}
			}
		}
	});

	const torunamentLoosed = userStats.tournamentsPlayed - userStats.winsInTournaments;
	const statsTournamentChart = new Chart(ctx2, {
		type: 'pie',
		data: {
			labels: ['Wins', 'Losses', 'Total'],
			datasets: [{
				data: [userStats.winsInTournaments, torunamentLoosed, userStats.tournamentsPlayed],

				backgroundColor: ['#ffe90d', '#bc3112', '#feab39'], 
				borderColor: '#1F2937',
				borderWidth: 2
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					labels: {
						color: 'white'
					}
				}
			}
		}
	});

	function navivageBack() {
		const container = document.getElementById("stats-modal");
		if (container) {
			container.remove();
		}
		window.removeEventListener("popstate", navivageBack);
	};

	// 🖱️ Doble click handler for game stats
	canvas.addEventListener('dblclick', async function (event) {
		const points = statsChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

		if (points.length) {
			const index = points[0].index;
			const label = statsChart.data.labels[index];
			const color = statsChart.data.datasets[0].backgroundColor[index]

			//Obtenemos todas las partidas
			try {
				const gameRecords = await fetchGameLogs();
				const users = await fetchUsers();
				console.log("users", users);
				const response = await fetch("../../html/stats/statslist.html");
				let htmlTemplate = await response.text();
				// Generar el contenido dinámico

				let tableRows = "";
				gameRecords.forEach((record: { createdAt: string; winner: string; loser: string; duration: number; tournamentId: string | null }) => {
					const date = new Date(record.createdAt).toLocaleString();
					const tournamentInfo = record.tournamentId ? `Tournament: ${record.tournamentId}` : "Non-tournament game";
					if (label === 'Wins') {
						if (record.winner == userID) {
							tableRows += `
							<tr class="hover:bg-pong-secondary ">
								<td class="p-2 border-b border-gray-700">${date}</td>
								<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
								<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
								<td class="p-2 border-b border-gray-700">${formatTimeFromMilliseconds(record.duration)}</td>
								<td class="p-2 border-b border-gray-700">${tournamentInfo}</td>
								</tr>
							`;
						}
					} else if (label === 'Losses') {
						if (record.loser === userID) {
							tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
									<td class="p-2 border-b border-gray-700">${formatTimeFromMilliseconds(record.duration)}ms</td>
									<td class="p-2 border-b border-gray-700">${tournamentInfo}</td>
									</tr>
								`;
						}
					}
					else if (label === 'Total') {
						if (record.winner === userID || record.loser === userID) {
							tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
									<td class="p-2 border-b border-gray-700">${formatTimeFromMilliseconds(record.duration)}ms</td>
									<td class="p-2 border-b border-gray-700">${tournamentInfo}</td>
									</tr>
								`;
						}
					}
				});

				htmlTemplate = htmlTemplate.replace(/{{table_rows}}/g, tableRows);

				// Reemplazar los marcadores de posición
				htmlTemplate = htmlTemplate
					.replace(/{{label}}/g, label)
					.replace(/{{color}}/g, color)
					.replace(/{{table_rows}}/g, tableRows);

				// Insertar en el DOM
				const container = document.createElement("div");
				container.innerHTML = htmlTemplate;
				document.body.appendChild(container);
				const closeBtn = container.querySelector("#close-stats-modal");
				if (closeBtn) {
					window.addEventListener("popstate", navivageBack)
				}

				closeBtn?.addEventListener("click", () => {
					container.remove();
					window.removeEventListener("popstate", navivageBack);
				});
			} catch (error) {
				console.error("Error fetching game logs:", error);
			}
		}
	});

	// 🖱️ Doble click handler for tournament stats
	canvas2.addEventListener('dblclick', async function (event) {
		const points = statsTournamentChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

		if (points.length) {
			const index = points[0].index;
			const label = statsTournamentChart.data.labels[index];
			const color = statsChart.data.datasets[0].backgroundColor[index];
			const value = statsTournamentChart.data.datasets[0].data[index];

			// Ejecutar acción personalizada	
			console.log(`Doble clic en: ${label} (${value})`);
			// alert(`Doble clic en: ${label} (${value})`);

			// Podés llamar aquí a otra función según el label
			// if (label === 'Wins') { ... }

			//// Inicio prueba
				try {
				const gameRecords = await fetchGameLogs();
				const users = await fetchUsers();
				console.log("users", users);
				const response = await fetch("../../html/stats/statslist.html");
				let htmlTemplate = await response.text();
				// Generar el contenido dinámico

				let tableRows = "";
				gameRecords.forEach((record: { createdAt: string; winner: string; loser: string; duration: number; tournamentId: string | null }) => {
					const tournamentInfo = record.tournamentId ? `Tournament: ${record.tournamentId}` : "Non-tournament game";
					if (record.tournamentId) {
						const date = new Date(record.createdAt).toLocaleString();
						if (label === 'Wins') {
							if (record.winner == userID) {
								tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
								<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
								<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
								<td class="p-2 border-b border-gray-700">${formatTimeFromMilliseconds(record.duration)}</td>
								<td class="p-2 border-b border-gray-700">${tournamentInfo}</td>
								</tr>
							`;
						}
					} else if (label === 'Losses') {
						if (record.loser === userID) {
							tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
									<td class="p-2 border-b border-gray-700">${formatTimeFromMilliseconds(record.duration)}ms</td>
									<td class="p-2 border-b border-gray-700">${tournamentInfo}</td>
									</tr>
								`;
						}
					}
					else if (label === 'Total') {
						if (record.winner === userID || record.loser === userID) {
							tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
									<td class="p-2 border-b border-gray-700">${formatTimeFromMilliseconds(record.duration)}ms</td>
									<td class="p-2 border-b border-gray-700">${tournamentInfo}</td>
									</tr>
								`;
						}
					}
					}
				});

				htmlTemplate = htmlTemplate.replace(/{{table_rows}}/g, tableRows);

				// Reemplazar los marcadores de posición
				htmlTemplate = htmlTemplate
					.replace(/{{label}}/g, label)
					.replace(/{{color}}/g, color)
					.replace(/{{table_rows}}/g, tableRows);

				// Insertar en el DOM
				const container = document.createElement("div");
				container.innerHTML = htmlTemplate;
				document.body.appendChild(container);
				const closeBtn = container.querySelector("#close-stats-modal");
				if (closeBtn) {
					window.addEventListener("popstate", navivageBack)
				}

				closeBtn?.addEventListener("click", () => {
					container.remove();
					window.removeEventListener("popstate", navivageBack);
				});
			} catch (error) {
				console.error("Error fetching game logs:", error);
			}

			//// Fin de prueba
		}
	});
}


export async function handleChessStats(userStats: { userId: string; wins: number; losses: number; draws: number; totalGames: number, tournamentsPlayed: number, winsInTournaments: number }): Promise<void> {
	userID = userStats.userId;
	initializeUserNames();
	// De esta forma hacemos que se ejectue el script de Chart.js
	if (typeof Chart === 'undefined') {
		await loadChartJs();
		// await loadChessChartJs();

	}
	// Asignamos el canvas a la variable
	const chesscanvas = document.getElementById('chess-statsChart') as HTMLCanvasElement | null;
	if (!chesscanvas) {
		console.error("Canvas element with id 'chess-statsChart' not found.");
		return;
	}
	// Asignamos el chesscanvas a la variable
	const chesscanvas2 = document.getElementById('chess-statsTournamentChart') as HTMLCanvasElement | null;
	if (!chesscanvas2) {
		console.error("Tournament Canvas element with id 'chess-statsTournamentChart' not found.");
		return;
	}
	// generamos el contexto 2D del chesscanvas
	const ctx = chesscanvas.getContext('2d');
	if (!ctx) {
		console.error("Failed to get 2D context from chesscanvas.");
		return;
	}
	// generamos el contexto 2D del chesscanvas
	const ctx2 = chesscanvas2.getContext('2d');
	if (!ctx2) {
		console.error("Failed to get 2D context from chesscanvas.");
		return;
	}

	const chessstatsChart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: ['Wins', 'Draws', 'Losses', 'Total'],
			datasets: [{
				data: [userStats.wins, userStats.draws, userStats.losses, userStats.totalGames],
				backgroundColor: ['#ffe90d', '#ce9700','#bc3112', '#feab39'], 
				borderColor: '#1F2937',
				borderWidth: 2
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					labels: {
						color: 'white'
					}
				}
			}
		}
	});

	const torunamentLoosed = userStats.tournamentsPlayed - userStats.winsInTournaments;
	const statsTournamentChart = new Chart(ctx2, {
		type: 'pie',
		data: {
			labels: ['Wins', 'Losses', 'Total'],
			datasets: [{
				data: [userStats.winsInTournaments, torunamentLoosed, userStats.tournamentsPlayed],

				backgroundColor: ['#ffe90d', '#bc3112', '#feab39'], 
				borderColor: '#1F2937',
				borderWidth: 2
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					labels: {
						color: 'white'
					}
				}
			}
		}
	});

	function navivageBack() {
		const container = document.getElementById("stats-modal");
		if (container) {
			container.remove();
		}
		window.removeEventListener("popstate", navivageBack);
	};

	// 🖱️ Doble click handler for game stats
	chesscanvas.addEventListener('dblclick', async function (event) {
		const points = chessstatsChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

		if (points.length) {
			const index = points[0].index;
			const label = chessstatsChart.data.labels[index];
			const color = chessstatsChart.data.datasets[0].backgroundColor[index]

			//Obtenemos todas las partidas
			try {
				const gameRecords = await fetchChessGameLogs();
				const users = await fetchUsers();
				console.log("users", users);
				const response = await fetch("../../html/stats/chessstatslist.html");
				let htmlTemplate = await response.text();
				// Generar el contenido dinámico

				let tableRows = "";
				gameRecords.forEach((record: { createdAt: string; winner: string; loser: string; duration: number; endtype: string  }) => {
					const date = new Date(record.createdAt).toLocaleString();
					// const endType = record.endtype ? `${record.tournamentId}` : "Non-tournament game";
					if (label === 'Wins') {
						if (record.winner == userID) {
							tableRows += `
							<tr class="hover:bg-pong-secondary ">
								<td class="p-2 border-b border-gray-700">${date}</td>
								<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
								<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
								<td class="p-2 border-b border-gray-700">${record.endtype}</td>
								</tr>
							`;
						}
					} else if (label === 'Losses') {
						if (record.loser === userID) {
							tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
									<td class="p-2 border-b border-gray-700">${record.endtype}</td>
									</tr>
								`;
						}
					} else if (label === 'Daws') {									
						if (record.loser === userID) {
							tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
									<td class="p-2 border-b border-gray-700">${record.endtype}</td>
									</tr>
								`;
						}
					}
					else if (label === 'Total') {
						if (record.winner === userID || record.loser === userID) {
							tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
									<td class="p-2 border-b border-gray-700">${record.endtype}</td>
									</tr>
								`;
						}
					}
				});

				htmlTemplate = htmlTemplate.replace(/{{table_rows}}/g, tableRows);

				// Reemplazar los marcadores de posición
				htmlTemplate = htmlTemplate
					.replace(/{{label}}/g, label)
					.replace(/{{color}}/g, color)
					.replace(/{{table_rows}}/g, tableRows);

				// Insertar en el DOM
				const container = document.createElement("div");
				container.innerHTML = htmlTemplate;
				document.body.appendChild(container);
				const closeBtn = container.querySelector("#close-stats-modal");
				if (closeBtn) {
					window.addEventListener("popstate", navivageBack)
				}

				closeBtn?.addEventListener("click", () => {
					container.remove();
					window.removeEventListener("popstate", navivageBack);
				});
			} catch (error) {
				console.error("Error fetching game logs:", error);
			}
		}
	});

	// 🖱️ Doble click handler for tournament stats
	chesscanvas2.addEventListener('dblclick', async function (event) {
		const points = statsTournamentChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

		if (points.length) {
			const index = points[0].index;
			const label = statsTournamentChart.data.labels[index];
			const color = chessstatsChart.data.datasets[0].backgroundColor[index];
			const value = statsTournamentChart.data.datasets[0].data[index];

			// Ejecutar acción personalizada	
			console.log(`Doble clic en: ${label} (${value})`);
			// alert(`Doble clic en: ${label} (${value})`);

			// Podés llamar aquí a otra función según el label
			// if (label === 'Wins') { ... }

			//// Inicio prueba
				try {
				const gameRecords = await fetchChessGameLogs();
				const users = await fetchUsers();
				console.log("users", users);
				const response = await fetch("../../html/stats/statslist.html");
				let htmlTemplate = await response.text();
				// Generar el contenido dinámico

				let tableRows = "";
				gameRecords.forEach((record: { createdAt: string; winner: string; loser: string; duration: number; tournamentId: string | null }) => {
					const tournamentInfo = record.tournamentId ? `Tournament: ${record.tournamentId}` : "Non-tournament game";
					if (record.tournamentId) {
						const date = new Date(record.createdAt).toLocaleString();
						if (label === 'Wins') {
							if (record.winner == userID) {
								tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
								<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
								<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
								<td class="p-2 border-b border-gray-700">${formatTimeFromMilliseconds(record.duration)}</td>
								<td class="p-2 border-b border-gray-700">${tournamentInfo}</td>
								</tr>
							`;
						}
					} else if (label === 'Losses') {
						if (record.loser === userID) {
							tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
									<td class="p-2 border-b border-gray-700">${formatTimeFromMilliseconds(record.duration)}ms</td>
									<td class="p-2 border-b border-gray-700">${tournamentInfo}</td>
									</tr>
								`;
						}
					}
					else if (label === 'Total') {
						if (record.winner === userID || record.loser === userID) {
							tableRows += `
								<tr class="hover:bg-pong-secondary ">
									<td class="p-2 border-b border-gray-700">${date}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.winner)}</td>
									<td class="p-2 border-b border-gray-700">${getUserNameById(record.loser)}</td>
									<td class="p-2 border-b border-gray-700">${formatTimeFromMilliseconds(record.duration)}ms</td>
									<td class="p-2 border-b border-gray-700">${tournamentInfo}</td>
									</tr>
								`;
						}
					}
					}
				});

				htmlTemplate = htmlTemplate.replace(/{{table_rows}}/g, tableRows);

				// Reemplazar los marcadores de posición
				htmlTemplate = htmlTemplate
					.replace(/{{label}}/g, label)
					.replace(/{{color}}/g, color)
					.replace(/{{table_rows}}/g, tableRows);

				// Insertar en el DOM
				const container = document.createElement("div");
				container.innerHTML = htmlTemplate;
				document.body.appendChild(container);
				const closeBtn = container.querySelector("#close-stats-modal");
				if (closeBtn) {
					window.addEventListener("popstate", navivageBack)
				}

				closeBtn?.addEventListener("click", () => {
					container.remove();
					window.removeEventListener("popstate", navivageBack);
				});
			} catch (error) {
				console.error("Error fetching game logs:", error);
			}

			//// Fin de prueba
		}
	});
}


// Cargamos por cdn Chart.js para no tener que instalarlo
async function loadChartJs(): Promise<void> {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		// script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
		script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.js';
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load Chart.js"));
		document.head.appendChild(script);
	});
}

// async function loadChessChartJs(): Promise<void> {
// 	return new Promise((resolve, reject) => {
// 		const script = document.createElement('script');
// 		// script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
// 		script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.js';
// 		script.onload = () => resolve();
// 		script.onerror = () => reject(new Error("Failed to load Chart.js"));
// 		document.head.appendChild(script);
// 	});
// }

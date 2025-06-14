"use strict";
// // 5. Detectar clics sobre el canvas para saber en qué casilla se ha hecho clic
// canvas.addEventListener("click", (event) => {
// 	const rect = canvas.getBoundingClientRect(); // obtener posición y tamaño del canvas
// 	const x = event.clientX - rect.left; // coordenada X relativa al canvas
// 	const y = event.clientY - rect.top;  // coordenada Y relativa al canvas
// 	const squareSize = getSquareSize();  // tamaño de cada casilla
// 	// Calcular columna (0–7) y fila (0–7) según la posición del clic
// 	const col = Math.floor(x / squareSize);
// 	const row = Math.floor(y / squareSize);
// 	// Convertir columna a letra (a-h) y fila a número (8–1, de arriba a abajo)
// 	const file = String.fromCharCode(97 + col); // 97 = 'a'
// 	const rank = 8 - row;
// 	// Mostrar en consola la casilla clicada (formato algebraico: e4, b6, etc.)
// 	console.log(`Has hecho clic en: ${file}${rank}`);
// });
// // 6. Si el usuario cambia el tamaño de la ventana, redimensionar y redibujar el tablero
// window.addEventListener("resize", () => {
// 	resizeCanvas(); // ajustar tamaño interno del canvas
// 	drawBoard();    // volver a pintar el tablero con las nuevas dimensiones
// });

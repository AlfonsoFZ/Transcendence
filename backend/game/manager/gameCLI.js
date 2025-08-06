/**
 * gameLogs.js file to manage the partial usage of the game via CLI
 * - work in progress - this is only a draft/idea/example
 * The idea is creating a basic interface that interacts with CLI connected
 *  client (using wscat command) which offer a limited set of game commands
 */

// Accept self-signed certificates for local dev and silence warnings about it
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.removeAllListeners('warning');

import fetch from 'node-fetch';
import WebSocket from 'ws';
import readline from 'readline';
import https from 'https';

const	cliInput = readline.createInterface({input: process.stdin, output: process.stdout});

//Usage message for the CLI
function usage()
{
	console.log(`
Available comments:
		join           - Create game session

		join <gameID>  - Join existing game session

		ready          - Ready to start

		up             - Move paddle up

		down           - Move paddle down

		list           - List available games

		exit           - You can guess...

		help           - Show this usage message
`);
}

// Prompt user for email and password
async function promptCredentials()
{
	return new Promise((resolve) => {
		cliInput.question('Email: ', (email) => {
			cliInput.question('Password: ', (password) => {
				resolve({ email, password });
			});
		});
	});
}

//Authenticate user and extract token from cookie
async function loginAndGetToken(email, password)
{
	const res = await fetch('https://localhost:8443/back/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		headers: { 'Content-Type': 'application/json' },
		agent: new https.Agent({ rejectUnauthorized: false }),
	});

	if (!res.ok)
		return null;

	const cookies = res.headers.raw()['set-cookie'];
	if (!cookies)
		return null;
	const tokenCookie = cookies.find(c => c.startsWith('token='));
	if (!tokenCookie)
		return null;
	return tokenCookie.split(';')[0].split('=')[1];
}

// CLI command loop
function insertCommand(socket)
{
	cliInput.question('> ', (cmd) => {
		const [command, arg] = cmd.trim().split(' ');
		switch (command)
		{
			case 'join':
				socket.send(JSON.stringify({
					type: 'JOIN_GAME',
					mode: 'remote',
					...(arg ? { roomId: arg } : {})
				}));
				break;
			case 'ready':
				socket.send(JSON.stringify({ type: 'CLIENT_READY' }));
				break;
			case 'up':
				socket.send(JSON.stringify({ type: 'PLAYER_INPUT', input: { up: true, down: false } }));
				break;
			case 'down':
				socket.send(JSON.stringify({ type: 'PLAYER_INPUT', input: { up: false, down: true } }));
				break;
			case 'list':
				socket.send(JSON.stringify({ type: 'SHOW_GAMES' }));
				break;
			case 'exit':
				socket.close();
				return;
			case 'help':
				usage();
				break;
			default:
				console.log('Unknown command. Type "help" for usage.');
		}
		insertCommand(socket);
	});
}

// Handle incoming WebSocket messages
function handleSocketMessages(socket)
{
	socket.on('message', (data) => {
		try {
			const msg = JSON.parse(data);
			console.log('Server:', msg);
		} catch (e) {
			console.log('Server:', data);
		}
	});

	socket.on('close', () => {
		console.log('Connection closed.');
		cliInput.close();
		process.exit(0);
	});
}

// Main logic: handle token or login, then connect to WebSocket
(async () => {
	let token = null;

	// Check for --token argument
	const tokenArgIndex = process.argv.indexOf('--token');
	if (tokenArgIndex !== -1 && process.argv[tokenArgIndex + 1])
		token = process.argv[tokenArgIndex + 1];
	else
	{
		console.log('Please log in:');
		const { email, password } = await promptCredentials();
		token = await loginAndGetToken(email, password);
		if (!token)
		{
			console.log('Login failed. Please check your credentials.');
			process.exit(1);
		}
	}

	const socket = new WebSocket('wss://localhost:8443/back/ws/game', {
		headers: { Cookie: `token=${token}` },
		agent: new https.Agent({ rejectUnauthorized: false }),
	});

	socket.on('open', () => {
		console.log('Connected to game server.');
		usage();
		insertCommand(socket); // Only start command loop after connection
	});

	handleSocketMessages(socket);
})();


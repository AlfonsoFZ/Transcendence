// import {parse} from 'cookie';
// import fastifyWebsocket from '@fastify/websocket';


export function configureChatRoutes(fastify) {


	// fastify.get('/ws', { websocket: true }, (socket, req) => {
	// 	console.log("socket", socket);
	// 	socket.on('message', message => {
	// 		fastify.log.info(`SERVER: Message from the client: ${message.toString()}`);
	// 		socket.send(`SERVER: ${message.toString()} de vuelta para Alfonsete`)
	// 		socket.send('SERVER: HAKUNAMATATA')
	// 	})
	// })

	// fastify.register(fastifyWebsocket)
	fastify.register(async function (fastify) {
	  fastify.get('/ws/chat', { websocket: true }, (socket, req) => {
		console.log("HOLA ESTOTY EN EL SOCKET");
		socket.on('message', message => {
		  // message.toString() === 'hi from client'
		  socket.send('hi from server')
		})
	  })
	})


}






// const clients = new Map();

// fastify.get('/chat', { websocket: true }, async (connection, req) => {
// 	const socket = connection.socket;
// 	const cookies = parse(req.request.headers.cookie || '');
// 	const token = cookies.token;
// 	console.log('Token extraído: ', token);
// 	socket.on('message', (message) => {
// 		console.log('Mensaje recibido: ', message);
// 	})
// })

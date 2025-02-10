// Import Fastify
const path = require('path');
const fastify = require('fastify')();
const fastifyStatic = require('@fastify/static');
const fastifyCors = require('@fastify/cors');

// Register CORS and allow only requests from http://frontend:3000
fastify.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type'],
});

// Define a route to handle POST requests
fastify.post('/api/data', async (request, reply) => {
  const { key1, key2 } = request.body;

  console.log('Received data:', { key1, key2 });

  return { receivedKey1: 'data', receivedKey2: 'received' };
});

// Register app to serve static files
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'static'),
});

// Define a route
fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html');
});

// Initialize Server
const start = async () => {
  try {
    // Listenning in port 8000
    await fastify.listen({ port: 8000, host: '0.0.0.0' });
    console.log('Server listenning on http://localhost/8000');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

// Call the function to start server
start();

// Import Fastify
const fastify = require('fastify')();

// Define a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

// Initialize Server
const start = async () => {
  try {
    // Listenning in port 8000
    await fastify.listen({ port: 8000, host: '0.0.0.0' });
    console.log('Server listenning on http://localhost:8000');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

// Call the function to start server
start();

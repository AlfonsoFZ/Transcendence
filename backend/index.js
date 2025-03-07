import Fastify from "fastify";
import { configureServer, configureGoogleAuth } from './config/config.js';
import configureRoutes from './routes/routes.js';
import { sequelize } from './db/models/index.js';
import pino from 'pino';

const fastify = Fastify({ logger: false });

configureServer(fastify);
configureGoogleAuth(fastify);
configureRoutes(fastify);

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

// Initialize Server
const start = async () => {
  try {
    // Sync the database
    await sequelize.sync();
    console.log('Database synced');
    await fastify.listen({ port: 8000, host: '0.0.0.0' });
    console.log('Server listenning on http://backend:8000');
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
}

// Call the function to start server
start();

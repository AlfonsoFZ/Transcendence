import { registerCors } from './cors.js';
import { registerGoogleAuth } from './googleAuth.js';
import { registerStaticFiles } from './staticFiles.js';
import { registerWebsocket } from './websocket.js';

export function configureServer(fastify) {

	// registerDevTools(fastify);
	registerStaticFiles(fastify);
	registerCors(fastify);
	registerGoogleAuth(fastify);
	registerWebsocket(fastify);
}

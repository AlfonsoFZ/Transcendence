import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import { authenticateUserWithGoogleStrategy } from "../auth/user.js";

export function registerGoogleAuth(fastify) {

	// Verificar si las variables de entorno necesarias están configuradas
	if (!process.env.SESSION_SECRET) {
		console.warn('⚠️  SESSION_SECRET no está definido en .env. Google Auth no estará disponible.');
		return;
	}

	if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
		console.warn('⚠️  GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET no están definidos en .env. Google Auth no estará disponible.');
		console.warn('   Para habilitar Google Auth, edite el archivo .env e incluya sus variables de Google.');
	}

	// Register Fastify Secure Session
	fastify.register(fastifySecureSession, {
		secret: process.env.SESSION_SECRET,
		cookie: {
			path: '/'
		}
	})

	// Initialize Fastify Passport
	fastify.register(fastifyPassport.initialize());
	fastify.register(fastifyPassport.secureSession());

	// Use Google Strategy to authenticate user
	authenticateUserWithGoogleStrategy();

	// Define a serializer
	fastifyPassport.registerUserSerializer(async (user, request) => {
		return user;
	})

	// Define a deserializer
	fastifyPassport.registerUserDeserializer(async (user, request) => {
		return user;
	})

}

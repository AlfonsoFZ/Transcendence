import fastifyCors from "@fastify/cors";
import fastifyPassport from "@fastify/passport";
import GoogleStrategy from "passport-google-oauth20";
import fastifySecureSession from "@fastify/secure-session";
import { createUser, getUserByName } from "../database/crud.cjs";

export function configureServer(fastify) {

	// Register CORS
	fastify.register(fastifyCors, {
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ['Content-Type'],
	});
}

export function configureGoogleAuth(fastify) {

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

	// Use Google Strategy
	fastifyPassport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: "https://localhost:8443/back/auth/google/login",
		scope: ['profile', 'email']
	}, async function (accessToken, refreshToken, profile, cb) {
        try {
            // Search for the user in the database
            let user = await getUserByName(profile.displayName);
            // If user does not exist, create a new user
            if (!user){
                user = await createUser(profile.displayName, null, profile.emails[0].value);
				user.googleId = profile.id;
				user.avatarPath = profile.photos?.[0]?.value || null;
				user.googleToken = refreshToken;
				// Save the user
				await user.save();
			}
            // Return the user
			
            cb(null, user);
        } catch (err) {
            cb(err);
        }
	}));

	// Define a serializer
	fastifyPassport.registerUserSerializer(async (user, request) => {
		return user;
	})

	// Define a deserializer
	fastifyPassport.registerUserDeserializer(async (user, request) => {
		return user;
	})

}

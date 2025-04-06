import fastify from 'fastify';
import jwt from 'jsonwebtoken';
import { getUserByName } from "../database/crud.cjs";


const JWT_SECRET = process.env.JWT_SECRET;

export function setTokenCookie(username, reply) {

    // Set accessToken cookie with username
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    reply.setCookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 3600,
    });
}

// // modificada para usar el token de la cookie_ AFZ
// export function verifyToken (request, reply, done) {
// 	try {
// 		console.info('Verifying token ' , request.cookies.token);
// 		const token = request.cookies.token;
// 		if (!token) {
// 			return reply.status(401).send({ message: 'Token no incluidotrutru' });
// 		}
// 		const decoded = jwt.verify(token, JWT_SECRET);
// 		reply.send({ valid: true, user: decoded });
// 	} catch (error) {
// 		reply.status(401).send({ valid: false, message: 'Token inválido o expirado' });
// 	}
//     done();
// };

export function verifyToken (request, reply, done) {
	try {
		console.info('Verifying token', request.cookies.token);
		const token = request.cookies.token;
		
		if (!token) {
			reply.status(401).send({ message: 'Token no incluido' });
			return; // Cortamos la ejecución si no hay token
		}

		// Decodificamos el token y lo guardamos en request para usarlo en la ruta
		request.user = jwt.verify(token, process.env.JWT_SECRET);
		
		done(); // Continuar con la ejecución de la ruta protegida
	} catch (error) {
		reply.status(401).send({ valid: false, message: 'Token inválido o expirado' });
	}
};

export async function extractUserFromToken(token) {

    // Extract user from token
    try {
        if (!token) {
            console.log('No token provided.');
            return null;
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.username) {
            console.log('Invalid or missing username in token.');
            return null;
        }
        const username = decoded.username;
        const user = await getUserByName(username);
        return user;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

export function destroyTokenCookie(reply) {
    
    // Destroy accessToken cookie
    reply.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    });
}

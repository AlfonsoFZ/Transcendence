import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const verifyToken = (request, reply, done) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
        return reply.status(401).send({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token del encabezado
    if (!token) {
        return reply.status(401).send({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return reply.status(401).send({ message: 'Token no válido' });
        }
        request.user = decoded;
        done();
    });
};


// import { comparePassword } from '../db/users/PassUtils.cjs';
// import { getUserByName } from '../db/crud.cjs';
import pkg from '../database/users/PassUtils.cjs';
const { comparePassword } = pkg;
import pkg2 from '../database/crud.cjs';
const { getUserByEmail } = pkg2;
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const checkUser = async (email, password, reply) => {

	const user = await getUserByEmail(email);
	console.log('Buscando user:', email);
	if (!user) {
		return reply.status(401).send({ message: 'Nombre de usuario incorrecto' });
	  }
	  console.log(password);
	  console.log(user.password);
	  const isMatch = await comparePassword(password, user.password);
  
	  if (!isMatch) {
		return reply.status(401).send({ message: 'Contraseña incorrecta' });
	  }
	  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  
	  // Si la autenticación es exitosa
	  return reply.status(200).send({ message: 'Inicio de sesión exitoso', username: user.username, token: token });
};

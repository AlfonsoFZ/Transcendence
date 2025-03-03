import { comparePassword } from '../db/users/PassUtils.js';
import { getUserByName } from '../db/crud.js';


export const checkUser = async (email, password, reply) => {

	const user = await getUserByName(email);
	// console.log('EN checkUser, user:', user);
	if (!user) {
		return reply.status(401).send({ message: 'Nombre de usuario incorrecto' });
	  }

	  const isMatch = await comparePassword(password, user.password);
  
	  if (!isMatch) {
		return reply.status(401).send({ message: 'Contraseña incorrecta' });
	  }
  
	  // Si la autenticación es exitosa
	  return reply.status(200).send({ message: 'Inicio de sesión exitoso' });
};





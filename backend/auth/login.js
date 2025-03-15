// import { comparePassword } from '../db/users/PassUtils.cjs';
// import { getUserByName } from '../db/crud.cjs';
import pkg from '../database/users/PassUtils.cjs';
const { comparePassword } = pkg;
import pkg2 from '../database/crud.cjs';
const { getUserByName } = pkg2;


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





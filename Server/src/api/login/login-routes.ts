import * as express from 'express';
import { LoginController } from './login-controller';
import { Auth } from '../../utilities/auth';

// get meants get stuff from the server, post means send stuff to the server

export class LoginRoutes {
	static init(router: express.Router) {
		router.route('/login')
		.get(LoginController.login)
		.post(LoginController.pressLogin);
		
	}
}
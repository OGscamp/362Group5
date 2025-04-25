import { Router } from 'express';
import { LoginController } from './login-controller';

export class LoginRoutes {
  static init(router: Router): void {
    // Login routes
    router.post('/auth/login', LoginController.login);
    router.post('/auth/register', LoginController.register);
    router.post('/auth/logout', LoginController.logout);
    router.get('/auth/me', LoginController.getCurrentUser);
  }
}


import * as express from 'express';
import { LoginController } from './login-controller';
import { Auth } from '../../utilities/auth';

export class LoginRoutes {
  static init(router: express.Router): void {
    // ✅ Login route using passport
    router.post('/api/login', Auth.authenticate('custom'), (req, res) => {
      if (req.user?.action === 'createCookie') {
        res.cookie('path_authorized', 'true', {
          httpOnly: true,
          maxAge: 2678400000, // 31 days
        });
      }
      res.status(200).json({ message: 'Logged in successfully' });
    });

    // ✅ Account management routes
    router.post('/api/register', LoginController.register);
    router.post('/api/delete-user', LoginController.deleteUser);
    router.post('/api/update-password', LoginController.updatePassword);
  }
}


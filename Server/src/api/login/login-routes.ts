import * as express from 'express';
import { LoginController } from './login-controller';
import { Auth } from '../../utilities/auth';

export class LoginRoutes {
  static init(router: express.Router): void {
    // ✅ Login route using passport
    router.post('/api/login', Auth.authenticate('custom'), (req, res) => {
      const user = (req as any).user;

      if (user?.action === 'createCookie') {
        res.cookie('path_authorized', 'true', {
          httpOnly: true,
          maxAge: 2678400000, // 31 days
        });

        // 🔥 This cookie allows us to know which user is logged in
        res.cookie('username', user.username, {
          httpOnly: false, // frontend/Postman can read it
          maxAge: 2678400000,
        });
      }

      res.status(200).json({ message: 'Logged in successfully' });
    });

    // ✅ Account management routes
    router.post('/api/register', LoginController.register);
    router.post('/api/delete-user', LoginController.deleteUser);
    router.post('/api/update-password', LoginController.updatePassword);

    // ✅ Route to get current logged-in user info
    router.get('/api/me', Auth.protected, (req, res) => {
      const user = (req as any).user;

      if (user?.username) {
        res.status(200).json({ username: user.username });
      } else {
        res.status(401).json({ error: 'Not logged in' });
      }
    });
    
    // ✅ Logout route
    router.post('/api/logout', (req, res) => {
      res.clearCookie('path_authorized');
      res.clearCookie('username');
      res.status(200).json({ message: 'Logged out successfully' });
    });



  }
}


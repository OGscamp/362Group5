import { Router } from 'express';
import { AuthController } from '../auth/auth-controller';
import { Auth } from '../../utilities/auth';

const router = Router();

// Debug route
router.get('/debug', (req, res) => {
  res.json({ status: 'auth router loaded' });
});

// Auth routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.get('/me', Auth.verifyUser, AuthController.getCurrentUser);

export default router; 
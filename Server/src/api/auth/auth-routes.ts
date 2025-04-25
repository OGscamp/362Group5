import { Router } from 'express';
import { AuthController } from '../auth/auth-controller';

const router = Router();

// Auth routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getCurrentUser);

export default router; 
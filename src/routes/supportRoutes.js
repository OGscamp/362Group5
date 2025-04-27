import express from 'express';
import supportController from '../controllers/supportController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// Create a new support ticket
router.post('/', supportController.createTicket);

// Get all support tickets for the authenticated user
router.get('/', supportController.getTickets);

// Get a specific support ticket by ID
router.get('/:id', supportController.getTicketById);

export default router; 
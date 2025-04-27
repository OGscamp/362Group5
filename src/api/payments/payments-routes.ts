import { Router } from 'express';
import { PaymentsController } from './payments-controller';

const router = Router();

// Save form data
router.post('/payments', PaymentsController.addPaymentMethod);

// Get all form entries
router.get('/payments', PaymentsController.getPaymentMethods);

export default router; 
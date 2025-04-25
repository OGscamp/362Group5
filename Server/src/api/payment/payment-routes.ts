import { Router, Request, Response } from 'express';
import { PaymentController } from './payment-controller';
import { Auth } from '../../utilities/auth';

const router = Router();

// Get all payment methods for a user
router.get('/', Auth.verifyUser, async (req: Request, res: Response) => {
    await PaymentController.getPayments(req, res);
});

// Add a new payment method
router.post('/', Auth.verifyUser, async (req: Request, res: Response) => {
    await PaymentController.createPayment(req, res);
});

// Delete a payment method
router.delete('/:id', Auth.verifyUser, async (req: Request, res: Response) => {
    await PaymentController.deletePayment(req, res);
});

// Set default payment method
router.put('/:id/default', Auth.verifyUser, async (req: Request, res: Response) => {
    await PaymentController.setDefaultPayment(req, res);
});

export default router;

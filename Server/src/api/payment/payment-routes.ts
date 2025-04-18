import * as express from 'express';
import { PaymentController } from './payment-controller';
import { Auth } from '../../utilities/auth';

export class PaymentRoutes {
  static init(router: express.Router) {
    router.route('/api/payments')
      .get(Auth.protected, PaymentController.getPayments)
      .post(Auth.protected, PaymentController.createPayment);

	router.route('/api/payments/:id')
  	  .delete(Auth.protected, PaymentController.deletePayment);
  }
}

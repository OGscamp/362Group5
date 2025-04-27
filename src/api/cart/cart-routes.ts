import * as express from 'express';
import { CartController } from './cart-controller';
import { Auth } from '../../utilities/auth';

export class CartRoutes {
  static init(router: express.Router) {
    router.route('/cart')
      .get(Auth.verifyUser, CartController.getCart)
      .post(Auth.verifyUser, CartController.addToCart)
      .delete(Auth.verifyUser, CartController.clearCart);

    router.route('/cart/remove')
      .post(Auth.verifyUser, CartController.removeFromCart);
  }
}

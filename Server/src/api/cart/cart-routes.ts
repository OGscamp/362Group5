import * as express from 'express';
import { CartController } from './cart-controller';
import { Auth } from '../../utilities/auth';

export class CartRoutes {
  static init(router: express.Router) {
    router.route('/api/cart')
      .get(Auth.protected, CartController.getCart)
      .post(Auth.protected, CartController.addToCart)
      .delete(Auth.protected, CartController.clearCart);

    router.route('/api/cart/remove')
      .post(Auth.protected, CartController.removeFromCart);
  }
}

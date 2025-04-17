import * as express from 'express';
import { CartController } from './cart-controller';

export class CartRoutes {
  static init(router: express.Router) {
    router.route('/api/cart')
      .get(CartController.getCart)          // ?userId=123
      .post(CartController.addToCart)      // Add item
      .delete(CartController.clearCart);   // Clear all items

    router.route('/api/cart/remove')
      .post(CartController.removeFromCart); // Remove a specific item
  }
}

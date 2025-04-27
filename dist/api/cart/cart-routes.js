"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const cart_controller_1 = require("./cart-controller");
const auth_1 = require("../../utilities/auth");
class CartRoutes {
    static init(router) {
        router.route('/cart')
            .get(auth_1.Auth.verifyUser, cart_controller_1.CartController.getCart)
            .post(auth_1.Auth.verifyUser, cart_controller_1.CartController.addToCart)
            .delete(auth_1.Auth.verifyUser, cart_controller_1.CartController.clearCart);
        router.route('/cart/remove')
            .post(auth_1.Auth.verifyUser, cart_controller_1.CartController.removeFromCart);
    }
}
exports.CartRoutes = CartRoutes;
//# sourceMappingURL=cart-routes.js.map
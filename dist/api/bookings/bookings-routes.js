"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const bookings_controller_1 = require("./bookings-controller");
const auth_1 = require("../../utilities/auth");
class BookingRoutes {
    static init(router) {
        // Protected routes (require authentication)
        router.route('/bookings')
            .get(auth_1.Auth.verifyUser, bookings_controller_1.BookingController.getBookings)
            .post(auth_1.Auth.verifyUser, bookings_controller_1.BookingController.createBooking);
        router.route('/bookings/:id')
            .get(auth_1.Auth.verifyUser, bookings_controller_1.BookingController.getBookingById)
            .put(auth_1.Auth.verifyUser, bookings_controller_1.BookingController.updateBooking)
            .delete(auth_1.Auth.verifyUser, bookings_controller_1.BookingController.deleteBooking);
        // Specific route for updating booking status
        router.route('/bookings/:id/status')
            .put(auth_1.Auth.verifyUser, bookings_controller_1.BookingController.updateBookingStatus);
    }
}
exports.BookingRoutes = BookingRoutes;
//# sourceMappingURL=bookings-routes.js.map
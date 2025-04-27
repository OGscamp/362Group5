import * as express from 'express';
import { BookingController } from './bookings-controller';
import { Auth } from '../../utilities/auth';

export class BookingRoutes {
  static init(router: express.Router) {
    // Protected routes (require authentication)
    router.route('/bookings')
      .get(Auth.verifyUser, BookingController.getBookings)
      .post(Auth.verifyUser, BookingController.createBooking);

    router.route('/bookings/:id')
      .get(Auth.verifyUser, BookingController.getBookingById)
      .put(Auth.verifyUser, BookingController.updateBooking)
      .delete(Auth.verifyUser, BookingController.deleteBooking);

    // Specific route for updating booking status
    router.route('/bookings/:id/status')
      .put(Auth.verifyUser, BookingController.updateBookingStatus);
  }
} 
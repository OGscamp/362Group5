import express from 'express';
import cors from 'cors';
import authRoutes from './api/auth/auth-routes';
import propertyRoutes from './api/properties/property-routes';
import { BookingRoutes } from './api/bookings/bookings-routes';
import { reviewRoutes } from './api/reviews/review-routes';
import paymentsRouter from './api/payments/payments-routes';

const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize routes
BookingRoutes.init(router);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentsRouter);
app.use('/api', router);  // Use the router we initialized with BookingRoutes last

export default app; 
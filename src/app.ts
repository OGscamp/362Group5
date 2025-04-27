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
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize routes
BookingRoutes.init(router);

// Routes
app.use('/api/auth', authRoutes);  // Mount auth routes at /api/auth
app.use('/api/properties', propertyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentsRouter);
app.use('/api', router);  // Use the router we initialized with BookingRoutes last

export default app; 
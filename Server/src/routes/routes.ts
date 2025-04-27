import express, { Request, Response, NextFunction } from 'express';
import { PropertyController } from '../api/properties/property-controller';
import { ReviewController } from '../api/reviews/review-controller';
import { BookingController } from '../api/bookings/bookings-controller';
import { Auth } from '../utilities/auth';
import cors from 'cors';
import multer from 'multer';

import { ExampleRoutes } from '../api/example/example-routes';
import { CartRoutes } from '../api/cart/cart-routes';
import { PostingRoutes } from '../api/postings/postings-routes';
import { ReviewRoutes } from '../api/review/review-routes';
import { ChatController } from '../api/chat/chat-controller';
import paymentRouter from '../api/payment/payment-routes';
import { BookingRoutes } from '../api/bookings/bookings-routes';
import propertyRoutes from '../api/properties/property-routes';
import { randomUUID } from 'crypto';
import { reviewRoutes } from '../api/reviews/review-routes';
import { MongoConn } from '../utilities/mongo-connect';
import { v2 as cloudinary } from 'cloudinary';
import authRoutes from '../api/auth/auth-routes';
import supportRoutes from './support';
import mailboxRoutes from './mailbox';
import { getDb } from '../utilities/mongo';

const router = express.Router();

// Configure CORS
router.use(cors({
  origin: ['https://elaborate-yeot-7e93c3.netlify.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Debug route to check database status
router.get('/debug/db', async (req, res) => {
  try {
    const mongo = MongoConn.getInstance();
    await mongo.waitForDB();
    
    if (!mongo.notAirBnbDB) {
      res.status(500).json({ error: 'Database not connected' });
      return;
    }

    const collections = await mongo.notAirBnbDB.listCollections().toArray();
    res.json({
      status: 'connected',
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('Database debug error:', error);
    res.status(500).json({ 
      error: 'Database connection error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Register auth routes at /api/auth
router.use('/auth', authRoutes);

// Property routes
router.get('/properties', PropertyController.getAllProperties);
router.get('/properties/search', PropertyController.searchProperties);
router.get('/properties/:id', PropertyController.getPropertyById);
router.post('/properties', Auth.verifyUser, upload.array('photos', 10), PropertyController.createProperty);
router.put('/properties/:id', Auth.verifyUser, PropertyController.updateProperty);
router.delete('/properties/:id', Auth.verifyUser, PropertyController.deleteProperty);
router.post('/properties/:id/photos', Auth.verifyUser, upload.array('photos', 10), PropertyController.updatePropertyPhotos);
router.get('/properties/user/:userId', Auth.verifyUser, PropertyController.getPropertiesByUserId);

// Chat routes
router.post('/chat', Auth.verifyUser, ChatController.sendMessage);
router.get('/chat/:otherUserId', Auth.verifyUser, ChatController.getMessages);
router.get('/chat/unread/count', Auth.verifyUser, ChatController.getUnreadCount);

// Review routes
router.post('/reviews', Auth.verifyUser, ReviewController.createReview);
router.get('/reviews/property/:propertyId', ReviewController.getReviewsByProperty);
router.put('/reviews/:id', Auth.verifyUser, ReviewController.updateReview);
router.delete('/reviews/:id', Auth.verifyUser, ReviewController.deleteReview);

// Booking routes
router.post('/bookings', Auth.verifyUser, BookingController.createBooking);
router.get('/bookings', Auth.verifyUser, BookingController.getBookings);
router.get('/bookings/:id', Auth.verifyUser, BookingController.getBookingById);
router.put('/bookings/:id', Auth.verifyUser, BookingController.updateBooking);
router.put('/bookings/:id/status', Auth.verifyUser, BookingController.updateBookingStatus);
router.delete('/bookings/:id', Auth.verifyUser, BookingController.deleteBooking);

// Payment routes
router.use('/payments', paymentRouter);

// Register support ticket routes
router.use('/support', supportRoutes);

// Register mailbox routes
router.use('/mailbox', mailboxRoutes);

// Register cart routes
CartRoutes.init(router);

// Add a route to get all users (for mailbox username mapping)
router.get('/users', async (req, res) => {
  try {
    const db = await getDb();
    const users = await db.collection('users').find({}, { projection: { username: 1 } }).toArray();
    res.json(users.map(u => ({ _id: u._id.toString(), username: u.username })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;

export const setupRoutes = (app: express.Application) => {
  app.use('/api', router);
};

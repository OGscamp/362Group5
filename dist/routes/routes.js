"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const express_1 = __importDefault(require("express"));
const property_controller_1 = require("../api/properties/property-controller");
const review_controller_1 = require("../api/reviews/review-controller");
const bookings_controller_1 = require("../api/bookings/bookings-controller");
const auth_1 = require("../utilities/auth");
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const cart_routes_1 = require("../api/cart/cart-routes");
const chat_controller_1 = require("../api/chat/chat-controller");
const payment_routes_1 = __importDefault(require("../api/payment/payment-routes"));
const mongo_connect_1 = require("../utilities/mongo-connect");
const cloudinary_1 = require("cloudinary");
const auth_routes_1 = __importDefault(require("../api/auth/auth-routes"));
const support_1 = __importDefault(require("./support"));
const mailbox_1 = __importDefault(require("./mailbox"));
const mongo_1 = require("../utilities/mongo");
const router = express_1.default.Router();
// Configure CORS
router.use((0, cors_1.default)({
    origin: ['https://elaborate-yeot-7e93c3.netlify.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Configure multer for file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Debug route to check database status
router.get('/debug/db', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongo = mongo_connect_1.MongoConn.getInstance();
        yield mongo.waitForDB();
        if (!mongo.notAirBnbDB) {
            res.status(500).json({ error: 'Database not connected' });
            return;
        }
        const collections = yield mongo.notAirBnbDB.listCollections().toArray();
        res.json({
            status: 'connected',
            collections: collections.map(c => c.name)
        });
    }
    catch (error) {
        console.error('Database debug error:', error);
        res.status(500).json({
            error: 'Database connection error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Register auth routes at /api/auth
router.use('/auth', auth_routes_1.default);
// Property routes
router.get('/properties', property_controller_1.PropertyController.getAllProperties);
router.get('/properties/search', property_controller_1.PropertyController.searchProperties);
router.get('/properties/:id', property_controller_1.PropertyController.getPropertyById);
router.post('/properties', auth_1.Auth.verifyUser, upload.array('photos', 10), property_controller_1.PropertyController.createProperty);
router.put('/properties/:id', auth_1.Auth.verifyUser, property_controller_1.PropertyController.updateProperty);
router.delete('/properties/:id', auth_1.Auth.verifyUser, property_controller_1.PropertyController.deleteProperty);
router.post('/properties/:id/photos', auth_1.Auth.verifyUser, upload.array('photos', 10), property_controller_1.PropertyController.updatePropertyPhotos);
router.get('/properties/user/:userId', auth_1.Auth.verifyUser, property_controller_1.PropertyController.getPropertiesByUserId);
// Chat routes
router.post('/chat', auth_1.Auth.verifyUser, chat_controller_1.ChatController.sendMessage);
router.get('/chat/:otherUserId', auth_1.Auth.verifyUser, chat_controller_1.ChatController.getMessages);
router.get('/chat/unread/count', auth_1.Auth.verifyUser, chat_controller_1.ChatController.getUnreadCount);
// Review routes
router.post('/reviews', auth_1.Auth.verifyUser, review_controller_1.ReviewController.createReview);
router.get('/reviews/property/:propertyId', review_controller_1.ReviewController.getReviewsByProperty);
router.put('/reviews/:id', auth_1.Auth.verifyUser, review_controller_1.ReviewController.updateReview);
router.delete('/reviews/:id', auth_1.Auth.verifyUser, review_controller_1.ReviewController.deleteReview);
// Booking routes
router.post('/bookings', auth_1.Auth.verifyUser, bookings_controller_1.BookingController.createBooking);
router.get('/bookings', auth_1.Auth.verifyUser, bookings_controller_1.BookingController.getBookings);
router.get('/bookings/:id', auth_1.Auth.verifyUser, bookings_controller_1.BookingController.getBookingById);
router.put('/bookings/:id', auth_1.Auth.verifyUser, bookings_controller_1.BookingController.updateBooking);
router.put('/bookings/:id/status', auth_1.Auth.verifyUser, bookings_controller_1.BookingController.updateBookingStatus);
router.delete('/bookings/:id', auth_1.Auth.verifyUser, bookings_controller_1.BookingController.deleteBooking);
// Payment routes
router.use('/payments', payment_routes_1.default);
// Register support ticket routes
router.use('/support', support_1.default);
// Register mailbox routes
router.use('/mailbox', mailbox_1.default);
// Register cart routes
cart_routes_1.CartRoutes.init(router);
// Add a route to get all users (for mailbox username mapping)
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, mongo_1.getDb)();
        const users = yield db.collection('users').find({}, { projection: { username: 1 } }).toArray();
        res.json(users.map(u => ({ _id: u._id.toString(), username: u.username })));
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}));
exports.default = router;
const setupRoutes = (app) => {
    app.use('/api', router);
};
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=routes.js.map
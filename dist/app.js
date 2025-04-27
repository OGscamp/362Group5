"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./api/auth/auth-routes"));
const property_routes_1 = __importDefault(require("./api/properties/property-routes"));
const bookings_routes_1 = require("./api/bookings/bookings-routes");
const review_routes_1 = require("./api/reviews/review-routes");
const payments_routes_1 = __importDefault(require("./api/payments/payments-routes"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
// Middleware
app.use((0, cors_1.default)({
    origin: ['https://elaborate-yeot-7e93c3.netlify.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 hours
}));
app.use(express_1.default.json());
// Initialize routes
bookings_routes_1.BookingRoutes.init(router);
// Routes
app.use('/api/auth', auth_routes_1.default); // Mount auth routes at /api/auth
app.use('/api/properties', property_routes_1.default);
app.use('/api/reviews', review_routes_1.reviewRoutes);
app.use('/api/payments', payments_routes_1.default);
app.use('/api', router); // Use the router we initialized with BookingRoutes last
exports.default = app;
//# sourceMappingURL=app.js.map
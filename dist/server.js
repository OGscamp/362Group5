"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const mongo_connect_1 = require("./utilities/mongo-connect");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
// Load environment variables
(0, dotenv_1.config)();
exports.app = (0, express_1.default)();
// Middleware
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cookie_parser_1.default)());
// Health check endpoint
exports.app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Routes
exports.app.use('/api', routes_1.default);
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // Handle specific error types
    if (err.name === 'ValidationError') {
        res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
        return;
    }
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: 'Unauthorized',
            details: err.message
        });
        return;
    }
    // Default error response
    res.status(500).json({
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};
exports.app.use(errorHandler);
// Initialize MongoDB connection
const mongo = mongo_connect_1.MongoConn.getInstance();
mongo.waitForDB()
    .then(() => {
    console.log('MongoDB connection established');
})
    .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map
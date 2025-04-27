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
exports.AuthController = void 0;
const mongo_1 = require("../../utilities/mongo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                console.log('Login attempt:', { username, password });
                if (!username || !password) {
                    console.log('Missing credentials');
                    res.status(400).json({ error: 'Username and password are required' });
                    return;
                }
                const db = yield (0, mongo_1.getDb)();
                // Print all users for debugging
                const allUsers = yield db.collection('users').find({}).toArray();
                console.log('All users in DB:', allUsers);
                console.log('Searching for user:', username);
                const user = yield db.collection('users').findOne({ username, password });
                console.log('Found user:', user);
                if (!user) {
                    console.log('Invalid credentials');
                    res.status(401).json({ error: 'Invalid credentials' });
                    return;
                }
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
                console.log('Login successful, sending response');
                res.json({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: {
                        _id: user._id,
                        username: user.username
                    }
                });
            }
            catch (error) {
                console.error('Error in login:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to login',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const db = yield (0, mongo_1.getDb)();
                // Check if user already exists
                const existingUser = yield db.collection('users').findOne({ username });
                if (existingUser) {
                    res.status(400).json({ error: 'Username already exists' });
                    return;
                }
                // Create new user
                yield db.collection('users').insertOne({ username, password });
                res.status(201).json({ message: 'Account created successfully' });
            }
            catch (error) {
                console.error('Error registering user:', error);
                res.status(500).json({ error: 'Failed to register' });
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get token from Authorization header
                const authHeader = req.headers.authorization;
                if (authHeader) {
                    const token = authHeader.split(' ')[1];
                    if (token) {
                        // Verify token to get user ID
                        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                        if (decoded && decoded.userId) {
                            const db = yield (0, mongo_1.getDb)();
                            // Update user document to remove any session-related data
                            yield db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(decoded.userId) }, { $unset: { sessionId: "" } });
                        }
                    }
                }
                // Clear the session
                if (req.session) {
                    req.session.destroy((err) => {
                        if (err) {
                            console.error('Error destroying session:', err);
                            res.status(500).json({
                                success: false,
                                error: 'Failed to destroy session',
                                details: err.message
                            });
                            return;
                        }
                        res.json({
                            success: true,
                            message: 'Logged out successfully'
                        });
                    });
                }
                else {
                    res.json({
                        success: true,
                        message: 'Logged out successfully'
                    });
                }
            }
            catch (error) {
                console.error('Error logging out:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to logout',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // req.user is set by Auth.verifyUser middleware
                if (!req.user) {
                    res.status(401).json({ error: 'Not authenticated' });
                    return;
                }
                res.json(req.user);
            }
            catch (error) {
                console.error('Error getting current user:', error);
                res.status(500).json({ error: 'Failed to get current user' });
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth-controller.js.map
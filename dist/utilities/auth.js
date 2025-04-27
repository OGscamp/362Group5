"use strict";
// let passport = require('passport');
// import { Strategy as CustomStrategy } from 'passport-custom';
// import { MongoConn } from './mongo-connect';
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
exports.Auth = void 0;
const mongo_connect_1 = require("./mongo-connect");
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Auth {
    static verifyUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Verifying user...');
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // Get token from Authorization header
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    res.status(401).json({ error: 'No token provided' });
                    return;
                }
                const token = authHeader.split(' ')[1];
                if (!token) {
                    res.status(401).json({ error: 'No token provided' });
                    return;
                }
                try {
                    // Verify token
                    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                    console.log('Decoded token:', decoded);
                    const users = mongo.notAirBnbDB.collection('users');
                    const user = yield users.findOne({ _id: new mongodb_1.ObjectId(decoded.userId) });
                    if (!user) {
                        res.status(401).json({ error: 'User not found' });
                        return;
                    }
                    // Attach user to request with username
                    req.user = Object.assign(Object.assign({}, user), { username: user.username });
                    console.log('User attached to request:', req.user);
                    next();
                }
                catch (error) {
                    console.error('Token verification error:', error);
                    res.status(401).json({ error: 'Invalid token' });
                }
            }
            catch (error) {
                console.error('Auth error:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static verifyAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Verifying admin...');
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // Get token from Authorization header
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    res.status(401).json({ error: 'No token provided' });
                    return;
                }
                const token = authHeader.split(' ')[1];
                if (!token) {
                    res.status(401).json({ error: 'No token provided' });
                    return;
                }
                try {
                    // Verify token
                    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                    const users = mongo.notAirBnbDB.collection('users');
                    const user = yield users.findOne({ _id: new mongodb_1.ObjectId(decoded.userId) });
                    if (!user) {
                        res.status(401).json({ error: 'User not found' });
                        return;
                    }
                    if (!user.isAdmin) {
                        res.status(403).json({ error: 'Not authorized as admin' });
                        return;
                    }
                    // Attach user to request
                    req.user = user;
                    next();
                }
                catch (error) {
                    console.error('Token verification error:', error);
                    res.status(401).json({ error: 'Invalid token' });
                }
            }
            catch (error) {
                console.error('Error verifying admin:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.Auth = Auth;
//# sourceMappingURL=auth.js.map
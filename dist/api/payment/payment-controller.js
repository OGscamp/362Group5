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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const mongo_connect_1 = require("../../utilities/mongo-connect");
const mongodb_1 = require("mongodb");
class PaymentController {
    static createPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Get the username from the authenticated user
                const username = (_a = req.user) === null || _a === void 0 ? void 0 : _a.username;
                if (!username) {
                    return res.status(401).json({ error: 'User not authenticated' });
                }
                // Create payment object with user ID
                const payment = Object.assign(Object.assign({}, req.body), { userId: username, timestamp: new Date(), method: 'card', status: 'active' // Default status
                 });
                // Save to database
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const db = mongo.notAirBnbDB;
                if (!db) {
                    throw new Error('Database connection not available');
                }
                const result = yield db.collection('payments').insertOne(payment);
                if (!result) {
                    throw new Error('Failed to save payment');
                }
                res.status(201).json({
                    message: 'Payment method added successfully',
                    paymentMethod: Object.assign(Object.assign({}, payment), { _id: result.insertedId })
                });
            }
            catch (error) {
                console.error('Error creating payment:', error);
                res.status(500).json({ error: 'Failed to create payment' });
            }
        });
    }
    static getPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Get the username from the authenticated user
                const username = (_a = req.user) === null || _a === void 0 ? void 0 : _a.username;
                if (!username) {
                    return res.status(401).json({ error: 'User not authenticated' });
                }
                // Get payments for this user
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const db = mongo.notAirBnbDB;
                if (!db) {
                    throw new Error('Database connection not available');
                }
                const payments = yield db.collection('payments')
                    .find({ userId: username })
                    .toArray();
                console.log(`Found ${payments.length} payments for user ${username}`);
                res.json(payments || []);
            }
            catch (error) {
                console.error('Error getting payments:', error);
                res.status(500).json({ error: 'Failed to get payments' });
            }
        });
    }
    static deletePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const username = (_a = req.user) === null || _a === void 0 ? void 0 : _a.username;
                if (!username) {
                    return res.status(401).json({ error: 'User not authenticated' });
                }
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const db = mongo.notAirBnbDB;
                if (!db) {
                    throw new Error('Database connection not available');
                }
                const result = yield db.collection('payments')
                    .deleteOne({
                    _id: new mongodb_1.ObjectId(id),
                    userId: username
                });
                if (!(result === null || result === void 0 ? void 0 : result.deletedCount)) {
                    return res.status(404).json({ error: 'Payment not found or unauthorized' });
                }
                res.json({ message: 'Payment deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting payment:', error);
                res.status(500).json({ error: 'Failed to delete payment' });
            }
        });
    }
    static setDefaultPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ message: 'User not authenticated' });
                }
                const paymentId = req.params.id;
                if (!paymentId) {
                    return res.status(400).json({ message: 'Payment ID is required' });
                }
                const mongo = mongo_connect_1.MongoConn.getInstance();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // First, unset default flag for all user's payment methods
                yield mongo.notAirBnbDB.collection('payments').updateMany({ userId: userId }, { $set: { isDefault: false } });
                // Set the specified payment method as default
                const result = yield mongo.notAirBnbDB.collection('payments').updateOne({ _id: new mongodb_1.ObjectId(paymentId), userId: userId }, { $set: { isDefault: true } });
                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'Payment method not found' });
                }
                res.json({ message: 'Default payment method updated successfully' });
            }
            catch (error) {
                console.error('Error setting default payment method:', error);
                res.status(500).json({ message: 'Error setting default payment method' });
            }
        });
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment-controller.js.map
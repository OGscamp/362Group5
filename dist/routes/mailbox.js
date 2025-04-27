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
const express_1 = __importDefault(require("express"));
const auth_1 = require("../utilities/auth");
const mongo_connect_1 = require("../utilities/mongo-connect");
const router = express_1.default.Router();
// Send a message (user to host or host to user)
router.post('/send', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongo = mongo_connect_1.MongoConn.getInstance();
        yield mongo.waitForDB();
        if (!mongo.notAirBnbDB)
            throw new Error('Database connection not established');
        const messages = mongo.notAirBnbDB.collection('messages');
        const users = mongo.notAirBnbDB.collection('users');
        let { to, subject, body, bookingId } = req.body;
        if (!to || !body) {
            res.status(400).json({ error: 'Recipient and message body are required' });
            return;
        }
        // If 'to' is not a valid ObjectId, treat it as a username and resolve to _id
        let toId = to;
        if (typeof to === 'string' && !/^[a-fA-F0-9]{24}$/.test(to)) {
            const userDoc = yield users.findOne({ username: to });
            if (!userDoc) {
                res.status(400).json({ error: 'Recipient user not found' });
                return;
            }
            toId = userDoc._id.toString();
        }
        const message = {
            from: req.user._id.toString(),
            to: toId,
            subject: subject || '',
            body,
            bookingId: bookingId || null,
            timestamp: new Date(),
        };
        const result = yield messages.insertOne(message);
        res.status(201).json(Object.assign(Object.assign({}, message), { _id: result.insertedId }));
        return;
    }
    catch (error) {
        console.error('Error sending mailbox message:', error);
        res.status(500).json({ error: 'Failed to send message', details: error instanceof Error ? error.stack : error });
        return;
    }
}));
// Get inbox (messages received by the logged-in user)
router.get('/inbox', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongo = mongo_connect_1.MongoConn.getInstance();
        yield mongo.waitForDB();
        if (!mongo.notAirBnbDB)
            throw new Error('Database connection not established');
        const messages = mongo.notAirBnbDB.collection('messages');
        const userId = req.user._id.toString();
        const inbox = yield messages.find({ to: userId }).sort({ timestamp: -1 }).toArray();
        res.json(inbox);
        return;
    }
    catch (error) {
        console.error('Error fetching inbox:', error);
        res.status(500).json({ error: 'Failed to fetch inbox', details: error instanceof Error ? error.stack : error });
        return;
    }
}));
// Get sent messages (messages sent by the logged-in user)
router.get('/sent', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongo = mongo_connect_1.MongoConn.getInstance();
        yield mongo.waitForDB();
        if (!mongo.notAirBnbDB)
            throw new Error('Database connection not established');
        const messages = mongo.notAirBnbDB.collection('messages');
        const userId = req.user._id.toString();
        const sent = yield messages.find({ from: userId }).sort({ timestamp: -1 }).toArray();
        res.json(sent);
        return;
    }
    catch (error) {
        console.error('Error fetching sent messages:', error);
        res.status(500).json({ error: 'Failed to fetch sent messages', details: error instanceof Error ? error.stack : error });
        return;
    }
}));
exports.default = router;
//# sourceMappingURL=mailbox.js.map
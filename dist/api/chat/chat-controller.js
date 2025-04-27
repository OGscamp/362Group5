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
exports.ChatController = void 0;
const mongo_connect_1 = require("../../utilities/mongo-connect");
const mongodb_1 = require("mongodb");
function isValidObjectId(id) {
    return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
}
class ChatController {
    static sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Sending chat message...');
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const { receiverId, message } = req.body;
                if (!receiverId || !message) {
                    res.status(400).json({ error: 'Receiver ID and message are required' });
                    return;
                }
                // Check if there's an accepted booking between these users
                const bookings = mongo.notAirBnbDB.collection('bookings');
                const booking = yield bookings.findOne({
                    $or: [
                        { userId: user._id, hostId: isValidObjectId(receiverId) ? new mongodb_1.ObjectId(receiverId) : receiverId, status: 'accepted' },
                        { userId: isValidObjectId(receiverId) ? new mongodb_1.ObjectId(receiverId) : receiverId, hostId: user._id, status: 'accepted' }
                    ]
                });
                if (!booking) {
                    res.status(403).json({ error: 'You can only chat with users who have accepted your booking request' });
                    return;
                }
                const chat = mongo.notAirBnbDB.collection('chat');
                const newMessage = {
                    senderId: user._id,
                    receiverId: isValidObjectId(receiverId) ? new mongodb_1.ObjectId(receiverId) : receiverId,
                    message,
                    timestamp: new Date(),
                    read: false
                };
                const result = yield chat.insertOne(newMessage);
                console.log('Message sent successfully');
                res.status(201).json({
                    message: 'Message sent successfully',
                    chatId: result.insertedId
                });
            }
            catch (error) {
                console.error('Error sending message:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Fetching chat messages...');
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const { otherUserId } = req.params;
                if (!otherUserId) {
                    res.status(400).json({ error: 'Other user ID is required' });
                    return;
                }
                // Check if there's an accepted booking between these users
                const bookings = mongo.notAirBnbDB.collection('bookings');
                const booking = yield bookings.findOne({
                    $or: [
                        { userId: user._id, hostId: isValidObjectId(otherUserId) ? new mongodb_1.ObjectId(otherUserId) : otherUserId, status: 'accepted' },
                        { userId: isValidObjectId(otherUserId) ? new mongodb_1.ObjectId(otherUserId) : otherUserId, hostId: user._id, status: 'accepted' }
                    ]
                });
                if (!booking) {
                    res.status(403).json({ error: 'You can only view messages with users who have accepted your booking request' });
                    return;
                }
                const chat = mongo.notAirBnbDB.collection('chat');
                const messages = yield chat.find({
                    $or: [
                        { senderId: user._id, receiverId: isValidObjectId(otherUserId) ? new mongodb_1.ObjectId(otherUserId) : otherUserId },
                        { senderId: isValidObjectId(otherUserId) ? new mongodb_1.ObjectId(otherUserId) : otherUserId, receiverId: user._id }
                    ]
                }).sort({ timestamp: 1 }).toArray();
                // Mark messages as read
                yield chat.updateMany({
                    senderId: isValidObjectId(otherUserId) ? new mongodb_1.ObjectId(otherUserId) : otherUserId,
                    receiverId: user._id,
                    read: false
                }, { $set: { read: true } });
                console.log(`Found ${messages.length} messages`);
                res.json(messages);
            }
            catch (error) {
                console.error('Error fetching messages:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static getUnreadCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Getting unread message count...');
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const chat = mongo.notAirBnbDB.collection('chat');
                const count = yield chat.countDocuments({
                    receiverId: user._id,
                    read: false
                });
                console.log(`Found ${count} unread messages`);
                res.json({ count });
            }
            catch (error) {
                console.error('Error getting unread count:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat-controller.js.map
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
const mongodb_1 = require("mongodb");
const router = express_1.default.Router();
// Create a new support ticket
router.post('/', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongo = mongo_connect_1.MongoConn.getInstance();
        yield mongo.waitForDB();
        if (!mongo.notAirBnbDB) {
            throw new Error('Database connection not established');
        }
        const supportTickets = mongo.notAirBnbDB.collection('supporttickets');
        const ticket = {
            userId: new mongodb_1.ObjectId(req.user._id),
            subject: req.body.subject,
            message: req.body.message,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = yield supportTickets.insertOne(ticket);
        res.status(201).json(Object.assign({ _id: result.insertedId }, ticket));
    }
    catch (error) {
        console.error('Error creating support ticket:', error);
        res.status(500).json({ error: 'Failed to create support ticket', details: error instanceof Error ? error.stack : error });
    }
}));
// Get all tickets for the current user
router.get('/', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongo = mongo_connect_1.MongoConn.getInstance();
        yield mongo.waitForDB();
        if (!mongo.notAirBnbDB) {
            throw new Error('Database connection not established');
        }
        const supportTickets = mongo.notAirBnbDB.collection('supporttickets');
        const tickets = yield supportTickets.find({ userId: new mongodb_1.ObjectId(req.user._id) }).sort({ createdAt: -1 }).toArray();
        res.json(tickets);
    }
    catch (error) {
        console.error('Error fetching support tickets:', error);
        res.status(500).json({ error: 'Failed to fetch support tickets', details: error instanceof Error ? error.stack : error });
    }
}));
// Get a single ticket by ID
router.get('/:id', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongo = mongo_connect_1.MongoConn.getInstance();
        yield mongo.waitForDB();
        if (!mongo.notAirBnbDB) {
            throw new Error('Database connection not established');
        }
        const supportTickets = mongo.notAirBnbDB.collection('supporttickets');
        const ticket = yield supportTickets.findOne({ _id: new mongodb_1.ObjectId(req.params.id), userId: new mongodb_1.ObjectId(req.user._id) });
        if (!ticket) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }
        res.json(ticket);
    }
    catch (error) {
        console.error('Error fetching support ticket:', error);
        res.status(500).json({ error: 'Failed to fetch support ticket', details: error instanceof Error ? error.stack : error });
    }
}));
exports.default = router;
//# sourceMappingURL=support.js.map
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
exports.PostingController = void 0;
const mongo_connect_1 = require("../../utilities/mongo-connect");
const mongodb_1 = require("mongodb");
class PostingController {
    // Get all properties
    static getPostings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const collection = mongo.notAirBnbDB.collection("properties");
                const properties = yield collection.find({}).toArray();
                res.status(200).json(properties);
            }
            catch (error) {
                console.error('Error fetching properties:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // Get property by ID
    static getPostingById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const collection = mongo.notAirBnbDB.collection("properties");
                const property = yield collection.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!property) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                res.status(200).json(property);
            }
            catch (error) {
                console.error('Error fetching property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // Create property
    static createPosting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const property = Object.assign(Object.assign({}, req.body), { userId, createdAt: new Date(), updatedAt: new Date(), bookings: [], reviews: [] });
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const collection = mongo.notAirBnbDB.collection("properties");
                const result = yield collection.insertOne(property);
                res.status(201).json(Object.assign(Object.assign({}, property), { _id: result.insertedId }));
            }
            catch (error) {
                console.error('Error creating property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // Update property
    static updatePosting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const updates = Object.assign(Object.assign({}, req.body), { updatedAt: new Date() });
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const collection = mongo.notAirBnbDB.collection("properties");
                const result = yield collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id), userId }, { $set: updates }, { returnDocument: 'after' });
                if (!result) {
                    res.status(404).json({ error: 'Property not found or not authorized' });
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error updating property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // Delete property
    static deletePosting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const collection = mongo.notAirBnbDB.collection("properties");
                const result = yield collection.deleteOne({ _id: new mongodb_1.ObjectId(id), userId });
                if (result.deletedCount === 0) {
                    res.status(404).json({ error: 'Property not found or not authorized' });
                    return;
                }
                res.status(200).json({ message: 'Property deleted', id });
            }
            catch (error) {
                console.error('Error deleting property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.PostingController = PostingController;
//# sourceMappingURL=postings-controller.js.map
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
exports.ReviewController = void 0;
const mongo_connect_1 = require("../../utilities/mongo-connect");
class ReviewController {
    static addReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.username;
                const propertyId = req.params.id;
                const { comment, rating } = req.body;
                console.log('Debug - Adding Review:', {
                    userId,
                    propertyId,
                    comment,
                    rating
                });
                if (!comment || typeof rating !== 'number') {
                    res.status(400).json({ error: 'Missing comment or rating' });
                    return;
                }
                const newReview = {
                    propertyId,
                    userId,
                    comment,
                    rating,
                    createdAt: new Date()
                };
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const collection = mongo.notAirBnbDB.collection('reviews');
                yield collection.insertOne(newReview);
                res.status(201).json({ message: 'Review added', review: newReview });
            }
            catch (error) {
                console.error('Error adding review:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const propertyId = req.params.id;
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const collection = mongo.notAirBnbDB.collection('reviews');
                const reviews = yield collection.find({ propertyId }).sort({ createdAt: -1 }).toArray();
                res.status(200).json(reviews);
            }
            catch (error) {
                console.error('Error fetching reviews:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.username;
                const propertyId = req.params.id;
                const { comment } = req.body;
                const mongo = mongo_connect_1.MongoConn.getInstance();
                const collection = mongo.notAirBnbDB.collection('reviews');
                const result = yield collection.deleteOne({ propertyId, userId, comment });
                if (result.deletedCount === 0) {
                    res.status(404).json({ error: 'Review not found or not yours to delete' });
                    return;
                }
                res.status(200).json({ message: 'Review deleted' });
            }
            catch (error) {
                console.error('Error deleting review:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review-controller.js.map
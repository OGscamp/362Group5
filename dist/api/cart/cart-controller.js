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
exports.CartController = void 0;
const mongo_connect_1 = require("../../utilities/mongo-connect");
class CartController {
    static getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.username);
                const mongo = mongo_connect_1.MongoConn.getInstance();
                if (!mongo.notAirBnbDB)
                    throw new Error('Database not connected');
                const collection = mongo.notAirBnbDB.collection('cart');
                const cart = yield collection.findOne({ userId });
                res.status(200).json(cart || { userId, items: [] });
            }
            catch (error) {
                console.error('Error fetching cart:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.username);
                const item = req.body.item;
                const mongo = mongo_connect_1.MongoConn.getInstance();
                if (!mongo.notAirBnbDB)
                    throw new Error('Database not connected');
                const collection = mongo.notAirBnbDB.collection('cart');
                let result = yield collection.updateOne({ userId }, { $push: { items: item } }, { upsert: true });
                res.status(201).json({ message: 'Item added to cart', _id: result.upsertedId });
            }
            catch (error) {
                console.error('Error adding to cart:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static removeFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.username);
                const itemId = req.body.itemId;
                const mongo = mongo_connect_1.MongoConn.getInstance();
                if (!mongo.notAirBnbDB)
                    throw new Error('Database not connected');
                const collection = mongo.notAirBnbDB.collection('cart');
                let result = yield collection.updateOne({ userId }, { $pull: { items: { id: itemId } } });
                // Check if the item was found and removed
                if (result.modifiedCount === 0) {
                    res.status(404).json({ error: 'Item not found in cart' });
                    return;
                }
                res.status(200).json({ message: 'Item removed from cart' });
            }
            catch (error) {
                console.error('Error removing from cart:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static clearCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.username);
                const mongo = mongo_connect_1.MongoConn.getInstance();
                if (!mongo.notAirBnbDB)
                    throw new Error('Database not connected');
                const collection = mongo.notAirBnbDB.collection('cart');
                yield collection.updateOne({ userId }, { $set: { items: [] } });
                res.status(200).json({ message: 'Cart cleared' });
            }
            catch (error) {
                console.error('Error clearing cart:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart-controller.js.map
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
exports.PaymentsController = void 0;
const mongo_1 = require("../../utilities/mongo");
class PaymentsController {
    static addPaymentMethod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield (0, mongo_1.getDb)();
                const formData = req.body;
                // Just save whatever data was sent
                yield db.collection('forms').insertOne(Object.assign(Object.assign({}, formData), { createdAt: new Date() }));
                res.status(200).json({
                    message: 'Form saved successfully',
                    data: formData
                });
            }
            catch (error) {
                console.error('Error saving form:', error);
                res.status(500).json({ error: 'Failed to save form' });
            }
        });
    }
    static getPaymentMethods(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield (0, mongo_1.getDb)();
                const forms = yield db.collection('forms').find().toArray();
                res.status(200).json({ forms });
            }
            catch (error) {
                console.error('Error getting forms:', error);
                res.status(500).json({ error: 'Failed to get forms' });
            }
        });
    }
}
exports.PaymentsController = PaymentsController;
//# sourceMappingURL=payments-controller.js.map
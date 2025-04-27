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
const express_1 = require("express");
const payment_controller_1 = require("./payment-controller");
const auth_1 = require("../../utilities/auth");
const router = (0, express_1.Router)();
// Get all payment methods for a user
router.get('/', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_controller_1.PaymentController.getPayments(req, res);
}));
// Add a new payment method
router.post('/', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_controller_1.PaymentController.createPayment(req, res);
}));
// Delete a payment method
router.delete('/:id', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_controller_1.PaymentController.deletePayment(req, res);
}));
// Set default payment method
router.put('/:id/default', auth_1.Auth.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_controller_1.PaymentController.setDefaultPayment(req, res);
}));
exports.default = router;
//# sourceMappingURL=payment-routes.js.map
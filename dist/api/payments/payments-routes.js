"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payments_controller_1 = require("./payments-controller");
const router = (0, express_1.Router)();
// Save form data
router.post('/payments', payments_controller_1.PaymentsController.addPaymentMethod);
// Get all form entries
router.get('/payments', payments_controller_1.PaymentsController.getPaymentMethods);
exports.default = router;
//# sourceMappingURL=payments-routes.js.map
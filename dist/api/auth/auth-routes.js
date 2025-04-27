"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../auth/auth-controller");
const auth_1 = require("../../utilities/auth");
const router = (0, express_1.Router)();
// Debug route
router.get('/debug', (req, res) => {
    res.json({ status: 'auth router loaded' });
});
// Auth routes
router.post('/login', auth_controller_1.AuthController.login);
router.post('/register', auth_controller_1.AuthController.register);
router.post('/logout', auth_controller_1.AuthController.logout);
router.get('/me', auth_1.Auth.verifyUser, auth_controller_1.AuthController.getCurrentUser);
exports.default = router;
//# sourceMappingURL=auth-routes.js.map
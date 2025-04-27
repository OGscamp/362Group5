"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_1 = require("./property-controller");
const auth_1 = require("../../utilities/auth");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Get all properties (public)
router.get('/', property_controller_1.PropertyController.getAllProperties);
// Search properties (public)
router.get('/search', property_controller_1.PropertyController.searchProperties);
// Get property by ID (public)
router.get('/:id', property_controller_1.PropertyController.getPropertyById);
// Create property (protected)
router.post('/', auth_1.Auth.verifyUser, upload.array('photos', 10), property_controller_1.PropertyController.createProperty);
// Update property (protected)
router.put('/:id', auth_1.Auth.verifyUser, property_controller_1.PropertyController.updateProperty);
// Delete property (protected)
router.delete('/:id', auth_1.Auth.verifyUser, property_controller_1.PropertyController.deleteProperty);
// Update property photos (protected)
router.put('/:id/photos', auth_1.Auth.verifyUser, upload.array('photos', 10), property_controller_1.PropertyController.updatePropertyPhotos);
exports.default = router;
//# sourceMappingURL=property-routes.js.map
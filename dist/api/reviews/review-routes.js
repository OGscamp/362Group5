"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review-controller");
const auth_1 = require("../../utilities/auth");
const router = (0, express_1.Router)();
// Get all reviews for a property
router.get('/property/:propertyId', review_controller_1.ReviewController.getReviewsByProperty);
// Create a new review
router.post('/', auth_1.Auth.verifyUser, review_controller_1.ReviewController.createReview);
// Update a review
router.put('/:id', auth_1.Auth.verifyUser, review_controller_1.ReviewController.updateReview);
// Delete a review
router.delete('/:id', auth_1.Auth.verifyUser, review_controller_1.ReviewController.deleteReview);
exports.reviewRoutes = router;
//# sourceMappingURL=review-routes.js.map
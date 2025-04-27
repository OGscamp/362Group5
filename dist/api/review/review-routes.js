"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const review_controller_1 = require("./review-controller");
const auth_1 = require("../../utilities/auth");
class ReviewRoutes {
    static init(router) {
        // User must be logged in to post and delete reviews
        router.route('/api/review/:id')
            .get(review_controller_1.ReviewController.getReviews)
            .post(auth_1.Auth.verifyUser, review_controller_1.ReviewController.addReview)
            .delete(auth_1.Auth.verifyUser, review_controller_1.ReviewController.deleteReview);
    }
}
exports.ReviewRoutes = ReviewRoutes;
//# sourceMappingURL=review-routes.js.map
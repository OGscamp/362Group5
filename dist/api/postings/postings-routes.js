"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostingRoutes = void 0;
const postings_controller_1 = require("./postings-controller");
const auth_1 = require("../../utilities/auth");
class PostingRoutes {
    static init(router) {
        // Public routes
        router.route('/api/properties')
            .get(postings_controller_1.PostingController.getPostings);
        router.route('/api/properties/:id')
            .get(postings_controller_1.PostingController.getPostingById);
        // Protected routes (require authentication)
        router.route('/api/properties')
            .post(auth_1.Auth.verifyUser, postings_controller_1.PostingController.createPosting);
        router.route('/api/properties/:id')
            .put(auth_1.Auth.verifyUser, postings_controller_1.PostingController.updatePosting)
            .delete(auth_1.Auth.verifyUser, postings_controller_1.PostingController.deletePosting);
    }
}
exports.PostingRoutes = PostingRoutes;
//# sourceMappingURL=postings-routes.js.map
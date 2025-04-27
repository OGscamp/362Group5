import * as express from 'express';
import { PostingController } from './postings-controller';
import { Auth } from '../../utilities/auth';

export class PostingRoutes {
  static init(router: express.Router) {
    // Public routes
    router.route('/api/properties')
      .get(PostingController.getPostings);

    router.route('/api/properties/:id')
      .get(PostingController.getPostingById);

    // Protected routes (require authentication)
    router.route('/api/properties')
      .post(Auth.verifyUser, PostingController.createPosting);

    router.route('/api/properties/:id')
      .put(Auth.verifyUser, PostingController.updatePosting)
      .delete(Auth.verifyUser, PostingController.deletePosting);
  }
}
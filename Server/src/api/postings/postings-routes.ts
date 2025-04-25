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
      .post(Auth.protected, PostingController.createPosting);

    router.route('/api/properties/:id')
      .put(Auth.protected, PostingController.updatePosting)
      .delete(Auth.protected, PostingController.deletePosting);
  }
}
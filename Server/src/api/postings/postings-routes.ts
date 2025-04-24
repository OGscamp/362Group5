import * as express from 'express';
import { PostingController } from './postings-controller';
import { Auth } from '../../utilities/auth';

export class PostingRoutes {
  static init(router: express.Router) {
    router.route('/api/postings')
      .get(PostingController.getPostings)
      .post(Auth.protected, PostingController.createPosting);

    router.route('/api/postings/:id')
      .delete(Auth.protected, PostingController.deletePosting);
  }
}
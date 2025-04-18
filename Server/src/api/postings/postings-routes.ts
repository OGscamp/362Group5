// src/api/postings/posting-routes.ts

import * as express from 'express';
import { PostingController } from './postings-controller';

export class PostingRoutes {
  static init(router: express.Router) {
    router.route('/api/postings')
      .get(PostingController.getPostings)
      .post(PostingController.createPosting);

    router.route('/api/postings/:id')
      .delete(PostingController.deletePosting);
  }
}

import * as express from 'express';
import { ReviewController } from './review-controller';
import { Auth } from '../../utilities/auth';

export class ReviewRoutes {
  static init(router: express.Router): void {
    // User must be logged in to post and delete reviews
    router.route('/api/review/:id')
      .get(ReviewController.getReviews)
      .post(Auth.protected, ReviewController.addReview)
      .delete(Auth.protected, ReviewController.deleteReview);
  }
}

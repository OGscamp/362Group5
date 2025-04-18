import * as express from 'express';

// In-memory review store keyed by posting ID
const reviews: { [postingId: string]: { user: string; comment: string }[] } = {};

export class ReviewController {
  // Add review to a posting
  static async addReview(req: express.Request, res: express.Response): Promise<void> {
    try {
      const postingId = req.params.id;
      const { user, comment } = req.body;

      if (!user || !comment) {
        res.status(400).json({ error: 'Missing user or comment' });
        return;
      }

      if (!reviews[postingId]) {
        reviews[postingId] = [];
      }

      reviews[postingId].push({ user, comment });
      res.status(201).json({ message: 'Review added', review: { user, comment } });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get reviews for a posting
  static async getReviews(req: express.Request, res: express.Response): Promise<void> {
    try {
      const postingId = req.params.id;
      const postingReviews = reviews[postingId] || [];
      res.status(200).json(postingReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Delete review from a posting
  static async deleteReview(req: express.Request, res: express.Response): Promise<void> {
    try {
      const postingId = req.params.id;
      const { user, comment } = req.body;

      if (!reviews[postingId]) {
        res.status(404).json({ error: 'No reviews found for this posting' });
        return;
      }

      reviews[postingId] = reviews[postingId].filter(
        (review) => review.user !== user || review.comment !== comment
      );

      res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
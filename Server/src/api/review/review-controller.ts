import * as express from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { ObjectId } from 'mongodb';
import { Review } from './review-model';

export class ReviewController {
  static async addReview(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = (req as any).user?.username;
      const postingId = req.params.id;
      const { comment, rating } = req.body;

      if (!comment || typeof rating !== 'number') {
        res.status(400).json({ error: 'Missing comment or rating' });
        return;
      }

      const newReview: Review = {
        postingId,
        userId,
        comment,
        rating,
        createdAt: new Date()
      };

      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db('notairbnb').collection<Review>('reviews');
      await collection.insertOne(newReview);

      res.status(201).json({ message: 'Review added', review: newReview });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getReviews(req: express.Request, res: express.Response): Promise<void> {
    try {
      const postingId = req.params.id;
      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db('notairbnb').collection<Review>('reviews');

      const reviews = await collection.find({ postingId }).sort({ createdAt: -1 }).toArray();
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deleteReview(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = (req as any).user?.username;
      const postingId = req.params.id;
      const { comment } = req.body;

      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db('notairbnb').collection<Review>('reviews');

      const result = await collection.deleteOne({ postingId, userId, comment });

      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Review not found or not yours to delete' });
        return;
      }

      res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}


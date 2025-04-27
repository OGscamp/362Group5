import { Request, Response } from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { ObjectId } from 'mongodb';
import { Auth } from '../../utilities/auth';

export class ReviewController {
  // Create review
  static async createReview(req: Request, res: Response): Promise<void> {
    try {
      console.log('Creating new review...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      // Get user from request (set by auth middleware)
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { propertyId, rating, comment, bookingId } = req.body;
      
      if (!propertyId || !rating || !comment || !bookingId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const bookings = mongo.notAirBnbDB.collection('bookings');
      const reviews = mongo.notAirBnbDB.collection('reviews');
      
      // Log the user and property details
      console.log('Review request details:', {
        user: {
          username: user.username,
          _id: user._id
        },
        propertyId,
        bookingId,
        body: req.body
      });

      // Check if user has a booking for this property
      const bookingQuery = {
        propertyId: propertyId,
        userId: user.username,
        status: { $in: ['accepted', 'completed'] }
      };
      console.log('Booking query:', bookingQuery);

      const booking = await bookings.findOne(bookingQuery);
      console.log('Found booking:', booking);

      if (!booking) {
        // Log all bookings for this user to debug
        const allUserBookings = await bookings.find({ userId: user.username }).toArray();
        console.log('All bookings for user:', allUserBookings);
        
        res.status(403).json({ error: 'You can only review properties you have stayed at' });
        return;
      }

      const newReview = {
        propertyId: propertyId,
        userId: user.username,
        bookingId: bookingId,
        rating: Number(rating),
        comment,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Inserting new review:', newReview);
      const result = await reviews.insertOne(newReview);
      
      console.log('Review created successfully:', result.insertedId);
      res.status(201).json({ ...newReview, _id: result.insertedId });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get reviews by property
  static async getReviewsByProperty(req: Request, res: Response): Promise<void> {
    try {
      const { propertyId } = req.params;
      console.log(`Fetching reviews for property ID: ${propertyId}`);
      
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      const reviews = mongo.notAirBnbDB.collection('reviews');
      const propertyReviews = await reviews.find({ 
        propertyId: propertyId // Don't convert to ObjectId since it's stored as string
      }).toArray();
      
      console.log(`Found ${propertyReviews.length} reviews for property`);
      res.json(propertyReviews);
    } catch (error) {
      console.error('Error fetching property reviews:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete review
  static async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log(`Deleting review with ID: ${id}`);
      
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      // Get user from request (set by auth middleware)
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const reviews = mongo.notAirBnbDB.collection('reviews');
      const review = await reviews.findOne({ _id: new ObjectId(id) });
      
      if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      // Check if user is authorized to delete this review
      if (
        review.userId.toString() !== user._id.toString() &&
        review.userId.toString() !== user.username.toString()
      ) {
        res.status(403).json({ error: 'Not authorized to delete this review' });
        return;
      }

      await reviews.deleteOne({ _id: new ObjectId(id) });
      console.log('Review deleted successfully');
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log(`Updating review with ID: ${id}`);
      
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      // Get user from request (set by auth middleware)
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const reviews = mongo.notAirBnbDB.collection('reviews');
      const review = await reviews.findOne({ _id: new ObjectId(id) });
      
      if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      // Check if user is authorized to update this review
      if (review.userId.toString() !== user._id.toString()) {
        res.status(403).json({ error: 'Not authorized to update this review' });
        return;
      }

      const { rating, comment } = req.body;
      const updateData = {
        ...(rating && { rating: Number(rating) }),
        ...(comment && { comment }),
        updatedAt: new Date()
      };

      const result = await reviews.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      console.log('Review updated successfully');
      res.json(result);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 
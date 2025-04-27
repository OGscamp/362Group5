import { Router } from 'express';
import { ReviewController } from './review-controller';
import { Auth } from '../../utilities/auth';

const router = Router();

// Get all reviews for a property
router.get('/property/:propertyId', ReviewController.getReviewsByProperty);

// Create a new review
router.post('/', Auth.verifyUser, ReviewController.createReview);

// Update a review
router.put('/:id', Auth.verifyUser, ReviewController.updateReview);

// Delete a review
router.delete('/:id', Auth.verifyUser, ReviewController.deleteReview);

export const reviewRoutes = router; 
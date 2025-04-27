import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService, bookingService, reviewService } from '../services/api';
import { StarIcon, MapPinIcon, HomeIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';

const PropertyListing = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [review, setReview] = useState({
    rating: 5,
    comment: ''
  });
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [hasAcceptedBooking, setHasAcceptedBooking] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addToCart } = useCart();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log('Fetching property with ID:', id);
        const response = await propertyService.getPropertyById(id);
        console.log('Property response:', response);
        
        if (response) {
          setListing(response);
          setError(null);
        } else {
          setError('Property not found');
          setListing(null);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to fetch property details');
        setListing(null);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    const checkAcceptedBooking = async () => {
      if (!user) return;
      
      try {
        const response = await bookingService.getBookings();
        const hasBooking = response.some(booking => 
          booking.propertyId === id && 
          booking.userId === user.username && 
          booking.status === 'accepted'
        );
        setHasAcceptedBooking(hasBooking);
      } catch (err) {
        console.error('Error checking bookings:', err);
      }
    };

    checkAcceptedBooking();
  }, [id, user]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewService.getReviews(id);
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    // Show review form if review=true in URL and user has an accepted booking
    setShowReviewForm(searchParams.get('review') === 'true' && hasAcceptedBooking);
  }, [searchParams, hasAcceptedBooking]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to book this property');
      return;
    }

    // Validate required fields
    if (!bookingDates.checkIn || !bookingDates.checkOut) {
      alert('Please select both check-in and check-out dates');
      return;
    }

    if (bookingDates.guests < 1) {
      alert('Please select at least one guest');
      return;
    }

    try {
      const booking = {
        propertyId: listing._id,
        startDate: new Date(bookingDates.checkIn).toISOString(),
        endDate: new Date(bookingDates.checkOut).toISOString(),
        guests: Number(bookingDates.guests)
      };

      console.log('Creating booking with data:', booking);
      const response = await bookingService.createBooking(booking);
      console.log('Booking response:', response);
      
      if (response._id) {
        alert('Booking request sent!');
        // Reset booking dates
        setBookingDates({
          checkIn: '',
          checkOut: '',
          guests: 1
        });
      } else {
        throw new Error(response.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert(err.message || 'Failed to create booking. Please try again.');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }

    if (!hasAcceptedBooking) {
      alert('You can only leave a review for properties you have stayed at');
      return;
    }

    try {
      const reviewData = {
        propertyId: id,
        rating: review.rating,
        comment: review.comment,
        bookingId: bookingId
      };

      await reviewService.createReview(reviewData);
      
      // Refresh the reviews list
      const response = await reviewService.getReviews(id);
      setReviews(response.data);
      
      // Reset the form
      setReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error creating review:', err);
      alert('Failed to submit review. Please try again.');
    }
  };

  const calculateTotalPrice = () => {
    if (!bookingDates.checkIn || !bookingDates.checkOut) return 0;
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights * listing.price;
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      const response = await reviewService.getReviews(id);
      setReviews(response.data);
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Images */}
        <div className="space-y-4">
          <img
            src={listing.photos?.[0] ? listing.photos[0] : '/placeholder.jpg'}
            alt={listing.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="grid grid-cols-2 gap-4">
            {listing.photos?.slice(1, 3).map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${listing.title} - ${index + 2}`}
                className="w-1/2 h-32 object-cover"
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
            <div className="flex items-center mt-2">
              <MapPinIcon className="h-5 w-5 text-gray-500" />
              <span className="ml-2 text-gray-600">{listing.location}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1">{listing.rating || 'New'}</span>
            </div>
            <div className="flex items-center">
              <HomeIcon className="h-5 w-5 text-gray-500" />
              <span className="ml-1">{listing.bedrooms} bedrooms</span>
            </div>
            <div className="flex items-center">
              <SparklesIcon className="h-5 w-5 text-gray-500" />
              <span className="ml-1">{listing.bathrooms} bathrooms</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">About this property</h2>
            <p className="text-gray-600">{listing.description}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {listing.amenities?.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-gray-500" />
                  <span className="ml-2 text-gray-600">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReview({ ...review, rating: star })}
                        className="focus:outline-none"
                      >
                        <StarIcon
                          className={`h-8 w-8 ${
                            star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {/* Booking Form */}
          {!showReviewForm && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Book this property</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Check-in</label>
                    <input
                      type="date"
                      value={bookingDates.checkIn}
                      onChange={(e) => setBookingDates({ ...bookingDates, checkIn: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Check-out</label>
                    <input
                      type="date"
                      value={bookingDates.checkOut}
                      onChange={(e) => setBookingDates({ ...bookingDates, checkOut: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={bookingDates.guests}
                    onChange={(e) => setBookingDates({ ...bookingDates, guests: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total: ${calculateTotalPrice()}</span>
                  <button
                    type="submit"
                    className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
                  >
                    Book Now
                  </button>
                </div>
                <button
                  type="button"
                  className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => {
                    addToCart(listing, bookingDates.checkIn, bookingDates.checkOut, bookingDates.guests);
                    alert('Added to cart!');
                  }}
                >
                  Add to Cart
                </button>
              </form>
            </div>
          )}

          {/* Reviews Section */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            {loadingReviews ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-gray-500" />
                          <span className="ml-2 font-medium">{review.userName}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {(user?.username === review.userId || user?.username === listing.userId) && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing; 
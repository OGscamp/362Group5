import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StarIcon, MapPinIcon, HomeIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/solid';

const PropertyListing = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { listings, setListings } = useData();
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [review, setReview] = useState({
    rating: 5,
    comment: ''
  });

  const listing = listings.find(l => l.id === parseInt(id));

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
      </div>
    );
  }

  const handleBooking = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to book this property');
      return;
    }

    const booking = {
      id: Date.now(),
      propertyId: listing.id,
      userId: user.id,
      checkIn: bookingDates.checkIn,
      checkOut: bookingDates.checkOut,
      guests: bookingDates.guests,
      totalPrice: calculateTotalPrice(),
      status: 'pending'
    };

    // Update the listing with the new booking
    const updatedListing = {
      ...listing,
      bookings: [...(listing.bookings || []), booking]
    };

    setListings(listings.map(l => l.id === listing.id ? updatedListing : l));
    alert('Booking request sent!');
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }

    const newReview = {
      id: Date.now(),
      userId: user.id,
      userName: user.email.split('@')[0],
      rating: review.rating,
      comment: review.comment,
      date: new Date().toISOString()
    };

    const updatedListing = {
      ...listing,
      reviews: [...(listing.reviews || []), newReview],
      rating: calculateNewRating([...(listing.reviews || []), newReview])
    };

    setListings(listings.map(l => l.id === listing.id ? updatedListing : l));
    setReview({ rating: 5, comment: '' });
  };

  const calculateTotalPrice = () => {
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights * listing.price;
  };

  const calculateNewRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-96 object-cover rounded-lg"
          />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{listing.title}</h1>
          <p className="mt-2 text-gray-600 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-1" />
            {listing.location}
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-gray-600">{listing.rating}</span>
            </div>
            <div className="flex items-center">
              <HomeIcon className="h-5 w-5 text-gray-400" />
              <span className="ml-1 text-gray-600">{listing.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <SparklesIcon className="h-5 w-5 text-gray-400" />
              <span className="ml-1 text-gray-600">{listing.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <span className="ml-1 text-gray-600">Up to {listing.maxGuests} guests</span>
            </div>
          </div>
          <p className="mt-4 text-gray-600">{listing.description}</p>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
            {listing.reviews?.map(review => (
              <div key={review.id} className="border-b border-gray-200 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-gray-600">{review.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{review.comment}</p>
                <p className="mt-1 text-sm text-gray-500">- {review.userName}</p>
              </div>
            ))}
            {user && (
              <form onSubmit={handleReview} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <select
                      value={review.rating}
                      onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} stars</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea
                      required
                      value={review.comment}
                      onChange={(e) => setReview({ ...review, comment: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900">${listing.price}/night</h2>
            <form onSubmit={handleBooking} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-in</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDates.checkIn}
                  onChange={(e) => setBookingDates({ ...bookingDates, checkIn: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-out</label>
                <input
                  type="date"
                  required
                  min={bookingDates.checkIn || new Date().toISOString().split('T')[0]}
                  value={bookingDates.checkOut}
                  onChange={(e) => setBookingDates({ ...bookingDates, checkOut: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Guests</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={listing.maxGuests}
                  value={bookingDates.guests}
                  onChange={(e) => setBookingDates({ ...bookingDates, guests: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Total</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing; 
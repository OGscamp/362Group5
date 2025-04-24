import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StarIcon, MapPinIcon, HomeIcon, SparklesIcon } from '@heroicons/react/24/solid';

const ListingsPage = () => {
  const { user } = useAuth();
  const { listings, setListings } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: []
  });

  const userListings = listings.filter(listing => listing.host.email === user.email);

  const handleAddListing = (e) => {
    e.preventDefault();
    const listing = {
      ...newListing,
      id: Date.now(),
      rating: 0,
      reviews: [],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3'],
      host: {
        id: Date.now(),
        name: user.email.split('@')[0],
        email: user.email
      }
    };
    setListings([...listings, listing]);
    setShowAddForm(false);
    setNewListing({
      title: '',
      location: '',
      price: '',
      description: '',
      bedrooms: '',
      bathrooms: '',
      maxGuests: '',
      amenities: []
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
        >
          Add New Listing
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Listing</h2>
          <form onSubmit={handleAddListing} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price per night</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  value={newListing.bedrooms}
                  onChange={(e) => setNewListing({ ...newListing, bedrooms: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  value={newListing.bathrooms}
                  onChange={(e) => setNewListing({ ...newListing, bathrooms: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Guests</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  value={newListing.maxGuests}
                  onChange={(e) => setNewListing({ ...newListing, maxGuests: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
              >
                Add Listing
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {userListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
              <p className="mt-1 text-sm text-gray-500 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {listing.location}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <HomeIcon className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600">{listing.bedrooms} beds</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600">{listing.bathrooms} baths</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">{listing.rating}</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">${listing.price}/night</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsPage; 
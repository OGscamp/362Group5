import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListingsPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    photos: []
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const fetchUserListings = useCallback(async () => {
    try {
      setLoading(true);
      const allProperties = await propertyService.getAllProperties();
      const userProperties = allProperties.filter(property => property.userId === user.username);
      setListings(userProperties);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.username) {
      fetchUserListings();
    }
  }, [user, fetchUserListings]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setSelectedPhotos(prev => [...prev, ...photoUrls]);
    setNewListing(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const handleRemovePhoto = (index) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setNewListing(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewListing(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await propertyService.createProperty({
        ...newListing,
        userId: user.username,
        photos: newListing.photos
      });
      if (response.success) {
        toast.success('Listing created successfully');
        setShowAddForm(false);
        setNewListing({
          title: '',
          description: '',
          price: '',
          location: '',
          photos: []
        });
        setSelectedPhotos([]);
        fetchUserListings();
      } else {
        throw new Error(response.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(error.message || 'Failed to create listing');
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await propertyService.deleteProperty(id);
        toast.success('Listing deleted successfully');
        fetchUserListings();
      } catch (error) {
        console.error('Error deleting listing:', error);
        toast.error(error.response?.data?.error || 'Failed to delete listing');
      }
    }
  };

  const handleUpdatePhotos = async (id, photos) => {
    try {
      await propertyService.updatePropertyPhotos(id, photos);
      toast.success('Photos updated successfully');
      fetchUserListings();
    } catch (error) {
      console.error('Error updating photos:', error);
      toast.error('Failed to update photos');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Listing
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Add New Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newListing.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newListing.description}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={newListing.price}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={newListing.location}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-1 block w-full"
                />
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {selectedPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={photo} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map(listing => (
          <div key={listing._id} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="relative">
              {listing.photos && listing.photos.length > 0 ? (
                <img
                  src={listing.photos[0]}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No photos</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{listing.title}</h3>
              <p className="text-gray-600">{listing.location}</p>
              <p className="text-lg font-bold mt-2">${listing.price}/night</p>
              <div className="mt-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    handleUpdatePhotos(listing._id, [...listing.photos, ...files]);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsPage; 
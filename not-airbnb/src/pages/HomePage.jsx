import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/api';
import { StarIcon, MapPinIcon, HomeIcon } from '@heroicons/react/24/solid';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching all properties...');
        const properties = await propertyService.getAllProperties();
        console.log('Properties received:', properties);
        
        if (properties && Array.isArray(properties)) {
          // Get top 6 properties
          const topProperties = properties.slice(0, 6);
          setFeaturedProperties(topProperties);
        } else {
          console.warn('Invalid properties data received');
          setFeaturedProperties([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error?.message || 'Failed to fetch properties');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  const handleListProperty = () => {
    if (user) {
      navigate('/listings');
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h1 className="text-5xl font-bold mb-6">Find Your Perfect Stay</h1>
            <p className="text-xl mb-8">Discover unique places to stay, from cozy rooms to luxury homes</p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button
                type="submit"
                className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/property/${property._id}`)}
            >
              <img
                src={property.photos?.[0] ? `data:image/jpeg;base64,${property.photos[0]}` : '/placeholder-image.jpg'}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                <p className="text-gray-600 flex items-center mb-2">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  {property.location}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                    <span>{property.rating || 'New'}</span>
                  </div>
                  <span className="text-lg font-semibold">${property.price}/night</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to list your property?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of hosts who are earning extra income with us</p>
          <button
            onClick={handleListProperty}
            className="bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 transition-colors"
          >
            {user ? 'List Your Property' : 'Sign In to List Your Property'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/api';
import { StarIcon, MapPinIcon, HomeIcon, FunnelIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    startDate: null,
    endDate: null,
    rating: '',
    location: '',
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    fetchProperties(query);
  }, [location.search]);

  const fetchProperties = async (query) => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      
      if (query) searchParams.append('query', query);
      if (filters.minPrice) searchParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) searchParams.append('maxPrice', filters.maxPrice);
      if (filters.bedrooms) searchParams.append('bedrooms', filters.bedrooms);
      if (filters.rating) searchParams.append('rating', filters.rating);
      if (filters.location) searchParams.append('location', filters.location);

      console.log('Fetching properties with params:', searchParams.toString());
      const response = await propertyService.searchProperties(searchParams);
      console.log('Search response:', response);
      setProperties(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchProperties(new URLSearchParams(location.search).get('q') || '');
    setShowFilters(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full px-4 py-2 border rounded-lg"
                defaultValue={new URLSearchParams(location.search).get('q') || ''}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?q=${e.target.value}`);
                  }
                }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-4 flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <select
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Any</option>
                  <option value="4">4+ stars</option>
                  <option value="3">3+ stars</option>
                  <option value="2">2+ stars</option>
                </select>
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  onClick={applyFilters}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/property/${property._id}`)}
            >
              <img
                src={property.photos?.[0]?.data ? `data:${property.photos[0].contentType};base64,${property.photos[0].data}` : '/placeholder-image.jpg'}
                alt={property.title || 'Property'}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title || 'Untitled Property'}</h3>
                <p className="text-gray-600 flex items-center mb-2">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  {property.location || 'Location not specified'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-gray-600">{property.rating || 'New'}</span>
                  </div>
                  <div className="flex items-center">
                    <HomeIcon className="h-5 w-5 text-gray-400" />
                    <span className="ml-1 text-gray-600">{property.bedrooms || '?'} beds</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">${property.price || '?'}/night</p>
              </div>
            </div>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900">No properties found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search; 
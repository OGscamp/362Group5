import React, { createContext, useContext, useState, useEffect } from 'react';
import { propertyService } from '../services/api';
import { useAuth } from './AuthContext';

const PropertyContext = createContext();

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getAllProperties();
        setProperties(data);
        setError(null);
      } catch (error) {
        setError(error.error || 'Failed to fetch properties');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const getUserProperties = () => {
    if (!user) return [];
    return properties.filter(property => property.userId === user.username);
  };

  const getPropertyById = (id) => {
    return properties.find(property => property._id === id);
  };

  const createProperty = async (propertyData) => {
    try {
      setError(null);
      const newProperty = await propertyService.createProperty(propertyData);
      setProperties(prev => [...prev, newProperty]);
      return { success: true, property: newProperty };
    } catch (error) {
      setError(error.error || 'Failed to create property');
      return { success: false, error: error.error || 'Failed to create property' };
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      setError(null);
      const updatedProperty = await propertyService.updateProperty(id, propertyData);
      setProperties(prev => 
        prev.map(property => property._id === id ? updatedProperty : property)
      );
      return { success: true, property: updatedProperty };
    } catch (error) {
      setError(error.error || 'Failed to update property');
      return { success: false, error: error.error || 'Failed to update property' };
    }
  };

  const deleteProperty = async (id) => {
    try {
      setError(null);
      await propertyService.deleteProperty(id);
      setProperties(prev => prev.filter(property => property._id !== id));
      return { success: true };
    } catch (error) {
      setError(error.error || 'Failed to delete property');
      return { success: false, error: error.error || 'Failed to delete property' };
    }
  };

  const updatePropertyPhotos = async (id, photos) => {
    try {
      setError(null);
      const updatedProperty = await propertyService.updatePropertyPhotos(id, photos);
      setProperties(prev =>
        prev.map(property => property._id === id ? updatedProperty : property)
      );
      return { success: true, property: updatedProperty };
    } catch (error) {
      setError(error.error || 'Failed to update property photos');
      return { success: false, error: error.error || 'Failed to update property photos' };
    }
  };

  const value = {
    properties,
    loading,
    error,
    selectedProperty,
    setSelectedProperty,
    getUserProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    updatePropertyPhotos,
    clearError: () => setError(null)
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}; 
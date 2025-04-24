import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Luxury Beachfront Villa',
      location: 'Miami Beach, FL',
      price: 299,
      description: 'Beautiful beachfront villa with stunning ocean views. Perfect for families or groups looking for a luxurious stay in Miami Beach.',
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      rating: 4.9,
      reviews: [],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3'
      ],
      host: {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com'
      },
      bookings: [],
      messages: []
    },
    {
      id: 2,
      title: 'Modern Downtown Apartment',
      location: 'New York, NY',
      price: 199,
      description: 'Stylish apartment in the heart of downtown Manhattan. Close to all major attractions and public transportation.',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      rating: 4.7,
      reviews: [],
      images: [
        'https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3'
      ],
      host: {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com'
      },
      bookings: [],
      messages: []
    }
  ]);

  return (
    <DataContext.Provider value={{ listings, setListings }}>
      {children}
    </DataContext.Provider>
  );
};

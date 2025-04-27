import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from backend or localStorage on mount or user change
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (user) {
          const data = await cartService.getCart();
          setCart(data.items || []);
        } else {
          const savedCart = localStorage.getItem('cart');
          setCart(savedCart ? JSON.parse(savedCart) : []);
        }
      } catch (err) {
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [user]);

  // Save cart to localStorage for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (property, checkIn, checkOut, guests) => {
    const item = {
      id: property._id,
      title: property.title,
      price: property.price,
      photo: property.photos?.[0] || '',
      location: property.location,
    };
    let newCart;
    if (cart.find(i => i.id === item.id)) {
      newCart = cart;
    } else {
      newCart = [...cart, item];
    }
    setCart(newCart);
    if (user) {
      try {
        await cartService.addToCart(item);
      } catch (err) {
        setError('Failed to add to cart');
      }
    }
  };

  const removeFromCart = async (propertyId) => {
    const newCart = cart.filter(item => item.id !== propertyId);
    setCart(newCart);
    if (user) {
      try {
        await cartService.removeFromCart(propertyId);
      } catch (err) {
        setError('Failed to remove from cart');
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      try {
        await cartService.clearCart();
      } catch (err) {
        setError('Failed to clear cart');
      }
    } else {
      localStorage.removeItem('cart');
    }
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    clearError: () => setError(null)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 
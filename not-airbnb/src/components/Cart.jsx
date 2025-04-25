import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { bookingService } from '../services/api';

const Cart = () => {
  const { cart, removeFromCart, updateCartItem, calculateTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create bookings for each item in cart
      const bookings = await Promise.all(
        cart.map(item => 
          bookingService.createBooking({
            propertyId: item.property._id,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            guests: item.guests
          })
        )
      );

      // Clear cart on successful checkout
      clearCart();
      navigate('/bookings', { state: { success: true } });
    } catch (err) {
      setError(err.message || 'Failed to complete checkout');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {cart.map((item) => (
          <div key={item.property._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{item.property.title}</h3>
                <p className="text-gray-600">{item.property.location}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.property._id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-in</label>
                <input
                  type="date"
                  value={item.checkIn}
                  onChange={(e) => updateCartItem(item.property._id, { checkIn: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-out</label>
                <input
                  type="date"
                  value={item.checkOut}
                  onChange={(e) => updateCartItem(item.property._id, { checkOut: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Guests</label>
              <input
                type="number"
                min="1"
                value={item.guests}
                onChange={(e) => updateCartItem(item.property._id, { guests: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-gray-600">
                {formatDate(item.checkIn)} - {formatDate(item.checkOut)}
              </span>
              <span className="font-semibold">
                ${item.property.price} per night
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold">${calculateTotal()}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};

export default Cart; 
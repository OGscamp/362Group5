import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService, propertyService, paymentService } from '../services/api';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CalendarIcon,
  HomeIcon,
  UserIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, propertiesData] = await Promise.all([
          bookingService.getBookings(),
          propertyService.getAllProperties()
        ]);

        // Create a map of properties for quick lookup
        const propertyMap = propertiesData.reduce((acc, property) => {
          acc[property._id] = property;
          return acc;
        }, {});

        // Enrich bookings with property data
        const enrichedBookings = bookingsData.map(booking => {
          const property = propertyMap[booking.propertyId];
          return {
            ...booking,
            property: property || null,
            propertyTitle: property?.title || 'Unknown Property',
            propertyLocation: property?.location || 'Location not available',
            propertyImages: property?.images || [],
            guestName: booking.userId === user.username ? 'You' : booking.guestName || 'Guest',
            isHost: property?.userId === user.username
          };
        });

        // Filter bookings to show only relevant ones
        const filteredBookings = enrichedBookings.filter(booking => {
          // Show bookings where user is either the guest or the property owner
          return booking.userId === user.username || booking.property?.userId === user.username;
        });

        setBookings(filteredBookings);
        setProperties(propertiesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load bookings');
        setLoading(false);
      }
    };

    fetchData();
  }, [user.username]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    const fetchPaymentMethods = async () => {
      if (user) {
        try {
          const response = await paymentService.getPaymentMethods();
          setPaymentMethods(response.paymentMethods || []);
        } catch (error) {
          console.error('Error fetching payment methods:', error);
          toast.error('Failed to load payment methods');
        }
      }
    };

    fetchBookings();
    fetchPaymentMethods();
  }, [user]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const booking = bookings.find(b => b._id === bookingId);
      if (!booking) {
        setError('Booking not found');
        return;
      }

      // Only property owner can update status
      if (booking.property?.userId !== user.username) {
        setError('Only the property owner can update booking status');
        return;
      }

      await bookingService.updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
      toast.success('Booking status updated successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking status');
      toast.error('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const booking = bookings.find(b => b._id === bookingId);
      if (!booking) {
        setError('Booking not found');
        return;
      }

      // Only the guest who made the booking can delete it
      if (booking.userId !== user.username) {
        setError('You can only delete your own bookings');
        return;
      }

      await bookingService.deleteBooking(bookingId);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      toast.success('Booking deleted successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Failed to delete booking');
      toast.error('Failed to delete booking');
    }
  };

  const handleMessage = (booking) => {
    navigate(`/chat?propertyId=${booking.propertyId}&userId=${booking.userId}`);
  };

  const handleLeaveReview = (booking) => {
    navigate(`/property/${booking.propertyId}?review=true`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    
    // Validate card number length
    if (newPaymentMethod.cardNumber.length !== 16) {
      toast.error('Card number must be 16 digits');
      return;
    }

    try {
      const response = await paymentService.addPaymentMethod(newPaymentMethod);
      if (response.message) {
        toast.success(response.message);
        setPaymentMethods([...paymentMethods, response.paymentMethod]);
        setShowAddPaymentForm(false);
        setNewPaymentMethod({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardholderName: ''
        });
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method');
    }
  };

  const handleDeletePaymentMethod = async (paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      await paymentService.deletePaymentMethod(paymentId);
      setPaymentMethods(paymentMethods.filter(method => method._id !== paymentId));
      toast.success('Payment method deleted successfully');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentId) => {
    try {
      const response = await paymentService.setDefaultPaymentMethod(paymentId);
      if (response.message) {
        toast.success(response.message);
        setPaymentMethods(paymentMethods.map(method => ({
          ...method,
          isDefault: method._id === paymentId
        })));
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to set default payment method');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'all' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'pending' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'accepted' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setActiveTab('denied')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'denied' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Denied
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'payments' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Payments
          </button>
        </div>
      </div>
      
      {activeTab === 'payments' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Payment Methods</h2>
            <button
              onClick={() => setShowAddPaymentForm(true)}
              className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
            >
              Add Payment Method
            </button>
          </div>

          {showAddPaymentForm && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Add New Payment Method</h3>
              <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    value={newPaymentMethod.cardNumber}
                    onChange={(e) => {
                      // Only allow numbers and limit to 16 digits
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setNewPaymentMethod({ ...newPaymentMethod, cardNumber: value });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  {newPaymentMethod.cardNumber.length > 0 && newPaymentMethod.cardNumber.length < 16 && (
                    <p className="mt-1 text-sm text-red-600">Card number must be 16 digits</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={newPaymentMethod.expiryDate}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      value={newPaymentMethod.cvv}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                  <input
                    type="text"
                    value={newPaymentMethod.cardholderName}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardholderName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPaymentForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => {
              const lastFourDigits = method.cardNumber?.slice(-4) || '';
              return (
                <div key={method._id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <CreditCardIcon className="h-6 w-6 text-gray-500" />
                      <span className="text-lg font-semibold">
                        **** **** **** {lastFourDigits}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => handleDeletePaymentMethod(method._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {paymentMethods.length === 0 && !showAddPaymentForm && (
            <div className="text-center py-12">
              <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a payment method.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddPaymentForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-600"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(booking.status)}
                  <span className="text-lg font-semibold">
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {booking.status === 'pending' && booking.isHost && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'denied')}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Deny
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleMessage(booking)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 inline-flex items-center"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                    Message
                  </button>
                  {booking.status === 'accepted' && (
                    <>
                      {!booking.isHost && (
                        <button
                          onClick={() => handleLeaveReview(booking)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 inline-flex items-center"
                        >
                          <StarIcon className="h-5 w-5 mr-1" />
                          Leave Review
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 inline-flex items-center"
                      >
                        <TrashIcon className="h-5 w-5 mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <HomeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Property: {booking.propertyTitle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {booking.isHost ? 'Guest' : 'Host'}: {booking.isHost ? booking.guestName : 'Property Owner'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Location: {booking.propertyLocation}</span>
                </div>
              </div>

              {booking.propertyImages && booking.propertyImages.length > 0 && (
                <div className="mt-4">
                  <img
                    src={booking.propertyImages[0]}
                    alt={booking.propertyTitle}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No {activeTab} bookings found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage; 
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatService, bookingService } from '../services/api';
import { PaperAirplaneIcon, UserIcon } from '@heroicons/react/24/solid';
import { useLocation } from 'react-router-dom';

const ChatPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]); // List of users to chat with
  const [selectedUser, setSelectedUser] = useState(null); // The user you are chatting with
  const [messages, setMessages] = useState([]); // Messages with selected user
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Parse query params for auto-select
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userIdFromQuery = params.get('userId');
    if (userIdFromQuery) {
      // Try to find the user in the list
      const found = users.find(u => u._id === userIdFromQuery);
      if (found) {
        setSelectedUser(found);
      } else {
        // If not found, create a placeholder user object
        setSelectedUser({ _id: userIdFromQuery, username: userIdFromQuery });
      }
    }
  }, [location.search, users]);

  // Fetch users to chat with based on bookings
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const bookings = await bookingService.getBookings();
        const chatUsersMap = {};
        bookings.forEach(booking => {
          if (booking.status === 'accepted') {
            // If current user is guest, add host
            if (booking.userId === user._id || booking.userId === user.username) {
              if (booking.property?.userId && booking.property.userId !== user._id && booking.property.userId !== user.username) {
                chatUsersMap[booking.property.userId] = { _id: booking.property.userId, username: booking.property.userId };
              }
            }
            // If current user is host, add guest
            if (
              (booking.property?.userId === user._id || booking.property?.userId === user.username) &&
              booking.userId !== user._id && booking.userId !== user.username
            ) {
              chatUsersMap[booking.userId] = { _id: booking.userId, username: booking.userId };
            }
          }
        });
        setUsers(Object.values(chatUsersMap));
      } catch (err) {
        setUsers([]);
      }
    };
    if (user) fetchChatUsers();
  }, [user]);

  // Fetch messages when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const response = await chatService.getMessages(selectedUser._id);
          setMessages(response.data || response || []);
        } catch (err) {
          setMessages([]);
        }
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;
    try {
      await chatService.sendMessage({ receiverId: selectedUser._id, message });
      setMessage('');
      // Refresh messages
      const response = await chatService.getMessages(selectedUser._id);
      setMessages(response.data || response || []);
    } catch (err) {
      // Optionally show error
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* User List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <div className="space-y-2">
              {users.map(u => (
                <button
                  key={u._id}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedUser?._id === u._id
                      ? 'bg-rose-50 text-rose-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{u.username}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Chat with {selectedUser.username}</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={msg._id || idx}
                      className={`flex ${
                        msg.senderId === user._id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.senderId === user._id
                            ? 'bg-rose-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <UserIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {msg.senderId === user._id ? 'You' : selectedUser.username}
                          </span>
                        </div>
                        <p>{msg.message}</p>
                        <span className="text-xs opacity-75 mt-1 block">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                    />
                    <button
                      type="submit"
                      className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a user to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 
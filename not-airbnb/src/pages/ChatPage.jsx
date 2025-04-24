import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { PaperAirplaneIcon, UserIcon } from '@heroicons/react/24/solid';

const ChatPage = () => {
  const { user } = useAuth();
  const { listings, setListings } = useData();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);

  // Get all chats where user is either host or guest
  useEffect(() => {
    const userChats = listings
      .filter(listing => 
        listing.host.email === user.email || // User is host
        listing.bookings?.some(booking => booking.userId === user.id) // User is guest
      )
      .map(listing => ({
        id: listing.id,
        propertyTitle: listing.title,
        hostEmail: listing.host.email,
        hostName: listing.host.name,
        messages: listing.messages || [],
        lastMessage: listing.messages?.[listing.messages.length - 1] || null
      }))
      .sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
      });

    setChats(userChats);
  }, [listings, user.email, user.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      senderId: user.id,
      senderEmail: user.email,
      senderName: user.email.split('@')[0],
      timestamp: new Date().toISOString()
    };

    // Update the listing with the new message
    const updatedListings = listings.map(listing => {
      if (listing.id === selectedChat.id) {
        return {
          ...listing,
          messages: [...(listing.messages || []), newMessage]
        };
      }
      return listing;
    });

    setListings(updatedListings);

    // Update local state
    setChats(chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...(chat.messages || []), newMessage],
          lastMessage: newMessage
        };
      }
      return chat;
    }));

    setSelectedChat({
      ...selectedChat,
      messages: [...(selectedChat.messages || []), newMessage],
      lastMessage: newMessage
    });

    setMessage('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <div className="space-y-2">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedChat?.id === chat.id
                      ? 'bg-rose-50 text-rose-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{chat.propertyTitle}</div>
                  <div className="text-sm text-gray-500">
                    {chat.hostEmail === user.email ? 'Guest' : 'Host'}: {chat.hostEmail === user.email ? 'Guest' : chat.hostName}
                  </div>
                  {chat.lastMessage && (
                    <div className="text-sm text-gray-600 truncate">
                      {chat.lastMessage.senderEmail === user.email ? 'You' : chat.lastMessage.senderName}: {chat.lastMessage.text}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">{selectedChat.propertyTitle}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.hostEmail === user.email ? 'Guest' : 'Host'}: {selectedChat.hostEmail === user.email ? 'Guest' : selectedChat.hostName}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedChat.messages?.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderEmail === user.email ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.senderEmail === user.email
                            ? 'bg-rose-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <UserIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {msg.senderEmail === user.email ? 'You' : msg.senderName}
                          </span>
                        </div>
                        <p>{msg.text}</p>
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
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 
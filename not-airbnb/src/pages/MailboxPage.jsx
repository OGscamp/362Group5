import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MailboxPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('inbox');
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeSuccess, setComposeSuccess] = useState('');
  const [composeError, setComposeError] = useState('');
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [tab]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      // Build a map of _id to username
      const map = {};
      res.data.forEach(u => { map[u._id] = u.username; });
      setUserMap(map);
    } catch (err) {
      // fallback: leave userMap empty
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'inbox') {
        const res = await api.get('/mailbox/inbox');
        setInbox(res.data);
      } else {
        const res = await api.get('/mailbox/sent');
        setSent(res.data);
      }
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setComposeError('');
    setComposeSuccess('');
    if (!composeTo || !composeBody) {
      setComposeError('Recipient and message body are required');
      return;
    }
    try {
      await api.post('/mailbox/send', {
        to: composeTo,
        subject: composeSubject,
        body: composeBody,
      });
      setComposeSuccess('Message sent!');
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setShowCompose(false);
      fetchMessages();
    } catch (err) {
      setComposeError('Failed to send message');
    }
  };

  const renderMessages = (messages) => (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-gray-500">No messages.</div>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">
                {tab === 'inbox'
                  ? `From: ${userMap[msg.from] || msg.from}`
                  : `To: ${userMap[msg.to] || msg.to}`}
              </div>
              <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</div>
            </div>
            {msg.subject && <div className="font-bold mb-1">{msg.subject}</div>}
            <div>{msg.body}</div>
            {msg.bookingId && (
              <div className="text-xs text-gray-400 mt-2">Booking ID: {msg.bookingId}</div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mailbox</h1>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${tab === 'inbox' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('inbox')}
        >
          Inbox
        </button>
        <button
          className={`px-4 py-2 rounded-md ${tab === 'sent' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('sent')}
        >
          Sent
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        renderMessages(tab === 'inbox' ? inbox : sent)
      )}
    </div>
  );
};

export default MailboxPage; 
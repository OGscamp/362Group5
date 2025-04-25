import { Request, Response } from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { ObjectId } from 'mongodb';
import { Auth } from '../../utilities/auth';
import { ChatMessage } from './chat-model';

export class ChatController {
  static async sendMessage(req: Request, res: Response) {
    try {
      console.log('Sending chat message...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      // Get user from request (set by auth middleware)
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { receiverId, message } = req.body;
      if (!receiverId || !message) {
        res.status(400).json({ error: 'Receiver ID and message are required' });
        return;
      }

      // Check if there's an accepted booking between these users
      const bookings = mongo.notAirBnbDB.collection('bookings');
      const booking = await bookings.findOne({
        $or: [
          { userId: user._id, hostId: new ObjectId(receiverId), status: 'accepted' },
          { userId: new ObjectId(receiverId), hostId: user._id, status: 'accepted' }
        ]
      });

      if (!booking) {
        res.status(403).json({ error: 'You can only chat with users who have accepted your booking request' });
        return;
      }

      const chat = mongo.notAirBnbDB.collection<ChatMessage>('chat');
      
      const newMessage: ChatMessage = {
        senderId: user._id,
        receiverId: new ObjectId(receiverId),
        message,
        timestamp: new Date(),
        read: false
      };

      const result = await chat.insertOne(newMessage);
      
      console.log('Message sent successfully');
      res.status(201).json({
        message: 'Message sent successfully',
        chatId: result.insertedId
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getMessages(req: Request, res: Response) {
    try {
      console.log('Fetching chat messages...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      // Get user from request (set by auth middleware)
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { otherUserId } = req.params;
      if (!otherUserId) {
        res.status(400).json({ error: 'Other user ID is required' });
        return;
      }

      // Check if there's an accepted booking between these users
      const bookings = mongo.notAirBnbDB.collection('bookings');
      const booking = await bookings.findOne({
        $or: [
          { userId: user._id, hostId: new ObjectId(otherUserId), status: 'accepted' },
          { userId: new ObjectId(otherUserId), hostId: user._id, status: 'accepted' }
        ]
      });

      if (!booking) {
        res.status(403).json({ error: 'You can only view messages with users who have accepted your booking request' });
        return;
      }

      const chat = mongo.notAirBnbDB.collection<ChatMessage>('chat');
      
      const messages = await chat.find({
        $or: [
          { senderId: user._id, receiverId: new ObjectId(otherUserId) },
          { senderId: new ObjectId(otherUserId), receiverId: user._id }
        ]
      }).sort({ timestamp: 1 }).toArray();

      // Mark messages as read
      await chat.updateMany(
        {
          senderId: new ObjectId(otherUserId),
          receiverId: user._id,
          read: false
        },
        { $set: { read: true } }
      );
      
      console.log(`Found ${messages.length} messages`);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getUnreadCount(req: Request, res: Response) {
    try {
      console.log('Getting unread message count...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      // Get user from request (set by auth middleware)
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const chat = mongo.notAirBnbDB.collection<ChatMessage>('chat');
      
      const count = await chat.countDocuments({
        receiverId: user._id,
        read: false
      });
      
      console.log(`Found ${count} unread messages`);
      res.json({ count });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

import * as express from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { ChatMessage } from './chat-model';

export class ChatController {
  static async sendMessage(req: express.Request, res: express.Response): Promise<void> {
    try {
      const senderId = (req as any).user?.username;
      const { recipientId, message } = req.body;
      const timestamp = new Date().toISOString();

      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db("notairbnb").collection<ChatMessage>('chat');

      await collection.insertOne({ userId: senderId, recipientId, message, timestamp });

      res.status(201).json({ message: 'Message sent' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getChatHistory(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = (req as any).user?.username;
      const { withUser } = req.query;

      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db("notairbnb").collection<ChatMessage>('chat');

      const messages = await collection.find({
        $or: [
          { userId, recipientId: withUser },
          { userId: withUser, recipientId: userId }
        ]
      }).sort({ timestamp: 1 }).toArray();

      res.status(200).json(messages);
    } catch (error) {
      console.error('Error getting chat history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

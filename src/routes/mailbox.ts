import express from 'express';
import { Auth } from '../utilities/auth';
import { MongoConn } from '../utilities/mongo-connect';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';

const router = express.Router();

// Send a message (user to host or host to user)
router.post('/send', Auth.verifyUser, async (req: Request, res: Response) => {
  try {
    const mongo = MongoConn.getInstance();
    await mongo.waitForDB();
    if (!mongo.notAirBnbDB) throw new Error('Database connection not established');
    const messages = mongo.notAirBnbDB.collection('messages');
    const users = mongo.notAirBnbDB.collection('users');
    let { to, subject, body, bookingId } = req.body;
    if (!to || !body) {
      res.status(400).json({ error: 'Recipient and message body are required' });
      return;
    }
    // If 'to' is not a valid ObjectId, treat it as a username and resolve to _id
    let toId = to;
    if (typeof to === 'string' && !/^[a-fA-F0-9]{24}$/.test(to)) {
      const userDoc = await users.findOne({ username: to });
      if (!userDoc) {
        res.status(400).json({ error: 'Recipient user not found' });
        return;
      }
      toId = userDoc._id.toString();
    }
    const message = {
      from: req.user._id.toString(),
      to: toId,
      subject: subject || '',
      body,
      bookingId: bookingId || null,
      timestamp: new Date(),
    };
    const result = await messages.insertOne(message);
    res.status(201).json({ ...message, _id: result.insertedId });
    return;
  } catch (error) {
    console.error('Error sending mailbox message:', error);
    res.status(500).json({ error: 'Failed to send message', details: error instanceof Error ? error.stack : error });
    return;
  }
});

// Get inbox (messages received by the logged-in user)
router.get('/inbox', Auth.verifyUser, async (req: Request, res: Response) => {
  try {
    const mongo = MongoConn.getInstance();
    await mongo.waitForDB();
    if (!mongo.notAirBnbDB) throw new Error('Database connection not established');
    const messages = mongo.notAirBnbDB.collection('messages');
    const userId = req.user._id.toString();
    const inbox = await messages.find({ to: userId }).sort({ timestamp: -1 }).toArray();
    res.json(inbox);
    return;
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ error: 'Failed to fetch inbox', details: error instanceof Error ? error.stack : error });
    return;
  }
});

// Get sent messages (messages sent by the logged-in user)
router.get('/sent', Auth.verifyUser, async (req: Request, res: Response) => {
  try {
    const mongo = MongoConn.getInstance();
    await mongo.waitForDB();
    if (!mongo.notAirBnbDB) throw new Error('Database connection not established');
    const messages = mongo.notAirBnbDB.collection('messages');
    const userId = req.user._id.toString();
    const sent = await messages.find({ from: userId }).sort({ timestamp: -1 }).toArray();
    res.json(sent);
    return;
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ error: 'Failed to fetch sent messages', details: error instanceof Error ? error.stack : error });
    return;
  }
});

export default router; 
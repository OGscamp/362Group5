import express from 'express';
import { Auth } from '../utilities/auth';
import { Request, Response } from 'express';
import { MongoConn } from '../utilities/mongo-connect';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Create a new support ticket
router.post('/', Auth.verifyUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const mongo = MongoConn.getInstance();
    await mongo.waitForDB();
    if (!mongo.notAirBnbDB) {
      throw new Error('Database connection not established');
    }
    const supportTickets = mongo.notAirBnbDB.collection('supporttickets');
    const ticket = {
      userId: new ObjectId(req.user._id),
      subject: req.body.subject,
      message: req.body.message,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await supportTickets.insertOne(ticket);
    res.status(201).json({ _id: result.insertedId, ...ticket });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ error: 'Failed to create support ticket', details: error instanceof Error ? error.stack : error });
  }
});

// Get all tickets for the current user
router.get('/', Auth.verifyUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const mongo = MongoConn.getInstance();
    await mongo.waitForDB();
    if (!mongo.notAirBnbDB) {
      throw new Error('Database connection not established');
    }
    const supportTickets = mongo.notAirBnbDB.collection('supporttickets');
    const tickets = await supportTickets.find({ userId: new ObjectId(req.user._id) }).sort({ createdAt: -1 }).toArray();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ error: 'Failed to fetch support tickets', details: error instanceof Error ? error.stack : error });
  }
});

// Get a single ticket by ID
router.get('/:id', Auth.verifyUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const mongo = MongoConn.getInstance();
    await mongo.waitForDB();
    if (!mongo.notAirBnbDB) {
      throw new Error('Database connection not established');
    }
    const supportTickets = mongo.notAirBnbDB.collection('supporttickets');
    const ticket = await supportTickets.findOne({ _id: new ObjectId(req.params.id), userId: new ObjectId(req.user._id) });
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({ error: 'Failed to fetch support ticket', details: error instanceof Error ? error.stack : error });
  }
});

export default router; 
import * as express from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { ObjectId } from 'mongodb';
import { Auth } from '../../utilities/auth';

export class PostingController {
	// Get all postings
	static async getPostings(req: express.Request, res: express.Response): Promise<void> {
		try {
		  const mongo = MongoConn.getInstance();
		  const collection = mongo.notAirBnbDB.db("notairbnb").collection("postings");
	  
		  const postings = await collection.find({}).toArray();
		  res.status(200).json(postings);
		} catch (error) {
		  console.error('Error fetching postings:', error);
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  }
	  
  
	static async createPosting(req: express.Request, res: express.Response): Promise<void> {
		try {
		  const userId = (req as any).user?.username;
		  const posting = req.body;
		  posting.userId = userId;
	  
		  const mongo = MongoConn.getInstance();
		  const collection = mongo.notAirBnbDB.db("notairbnb").collection("postings");
	  
		  const result = await collection.insertOne(posting);
		  res.status(201).json({ message: 'Posting created', id: result.insertedId });
		} catch (error) {
		  console.error('Error creating posting:', error);
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  }
	  
  
	// Delete a posting
	static async deletePosting(req: express.Request, res: express.Response): Promise<void> {
		try {
		  const { id } = req.params;
		  const userId = (req as any).user?.username;
	  
		  const mongo = MongoConn.getInstance();
		  const collection = mongo.notAirBnbDB.db("notairbnb").collection("postings");
	  
		  const result = await collection.deleteOne({ _id: new ObjectId(id), userId });

	  
		  if (result.deletedCount === 0) {
			res.status(404).json({ error: 'Posting not found or not authorized' });
			return;
		  }
	  
		  res.status(200).json({ message: 'Posting deleted', id });
		} catch (error) {
		  console.error('Error deleting posting:', error);
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  }
	  
  }
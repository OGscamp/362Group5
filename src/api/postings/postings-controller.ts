import * as express from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { ObjectId } from 'mongodb';
import { Auth } from '../../utilities/auth';

export class PostingController {
	// Get all properties
	static async getPostings(req: express.Request, res: express.Response): Promise<void> {
		try {
			const mongo = MongoConn.getInstance();
			const collection = mongo.notAirBnbDB!.collection("properties");
			
			const properties = await collection.find({}).toArray();
			res.status(200).json(properties);
		} catch (error) {
			console.error('Error fetching properties:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}

	// Get property by ID
	static async getPostingById(req: express.Request, res: express.Response): Promise<void> {
		try {
			const { id } = req.params;
			const mongo = MongoConn.getInstance();
			const collection = mongo.notAirBnbDB!.collection("properties");
			
			const property = await collection.findOne({ _id: new ObjectId(id) });
			if (!property) {
				res.status(404).json({ error: 'Property not found' });
				return;
			}
	  
			res.status(200).json(property);
		} catch (error) {
			console.error('Error fetching property:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}

	// Create property
	static async createPosting(req: express.Request, res: express.Response): Promise<void> {
		try {
			const userId = (req as any).user?.id;
			const property = {
				...req.body,
				userId,
				createdAt: new Date(),
				updatedAt: new Date(),
				bookings: [],
				reviews: []
			};

			const mongo = MongoConn.getInstance();
			const collection = mongo.notAirBnbDB!.collection("properties");

			const result = await collection.insertOne(property);
			res.status(201).json({ ...property, _id: result.insertedId });
		} catch (error) {
			console.error('Error creating property:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}

	// Update property
	static async updatePosting(req: express.Request, res: express.Response): Promise<void> {
		try {
			const { id } = req.params;
			const userId = (req as any).user?.id;
			const updates = {
				...req.body,
				updatedAt: new Date()
			};

			const mongo = MongoConn.getInstance();
			const collection = mongo.notAirBnbDB!.collection("properties");

			const result = await collection.findOneAndUpdate(
				{ _id: new ObjectId(id), userId },
				{ $set: updates },
				{ returnDocument: 'after' }
			);

			if (!result) {
				res.status(404).json({ error: 'Property not found or not authorized' });
				return;
			}

			res.status(200).json(result);
		} catch (error) {
			console.error('Error updating property:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}

	// Delete property
	static async deletePosting(req: express.Request, res: express.Response): Promise<void> {
		try {
			const { id } = req.params;
			const userId = (req as any).user?.id;

			const mongo = MongoConn.getInstance();
			const collection = mongo.notAirBnbDB!.collection("properties");

			const result = await collection.deleteOne({ _id: new ObjectId(id), userId });

			if (result.deletedCount === 0) {
				res.status(404).json({ error: 'Property not found or not authorized' });
				return;
			}

			res.status(200).json({ message: 'Property deleted', id });
		} catch (error) {
			console.error('Error deleting property:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
}
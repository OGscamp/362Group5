import { Request, Response } from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { Payment } from './payment-model';
import { ObjectId } from 'mongodb';

export class PaymentController {
	static async createPayment(req: Request, res: Response) {
		try {
			// Get the username from the authenticated user
			const username = req.user?.username;
			if (!username) {
				return res.status(401).json({ error: 'User not authenticated' });
			}

			// Create payment object with user ID
			const payment: Payment = {
				...req.body,
				userId: username,
				timestamp: new Date(),
				method: 'card', // Default to card
				status: 'active' // Default status
			};

			// Save to database
			const mongo = MongoConn.getInstance();
			const db = mongo.notAirBnbDB;
			if (!db) {
				throw new Error('Database connection not available');
			}

			const result = await db.collection('payments').insertOne(payment);
			if (!result) {
				throw new Error('Failed to save payment');
			}

			res.status(201).json({
				message: 'Payment method added successfully',
				paymentMethod: { ...payment, _id: result.insertedId }
			});
		} catch (error) {
			console.error('Error creating payment:', error);
			res.status(500).json({ error: 'Failed to create payment' });
		}
	}

	static async getPayments(req: Request, res: Response) {
		try {
			// Get the username from the authenticated user
			const username = req.user?.username;
			if (!username) {
				return res.status(401).json({ error: 'User not authenticated' });
			}

			// Get payments for this user
			const mongo = MongoConn.getInstance();
			const db = mongo.notAirBnbDB;
			if (!db) {
				throw new Error('Database connection not available');
			}

			const payments = await db.collection('payments')
				.find({ userId: username })
				.toArray();

			console.log(`Found ${payments.length} payments for user ${username}`);
			res.json(payments || []);
		} catch (error) {
			console.error('Error getting payments:', error);
			res.status(500).json({ error: 'Failed to get payments' });
		}
	}

	static async deletePayment(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const username = req.user?.username;
			if (!username) {
				return res.status(401).json({ error: 'User not authenticated' });
			}

			const mongo = MongoConn.getInstance();
			const db = mongo.notAirBnbDB;
			if (!db) {
				throw new Error('Database connection not available');
			}

			const result = await db.collection('payments')
				.deleteOne({ 
					_id: new ObjectId(id), 
					userId: username 
				});

			if (!result?.deletedCount) {
				return res.status(404).json({ error: 'Payment not found or unauthorized' });
			}

			res.json({ message: 'Payment deleted successfully' });
		} catch (error) {
			console.error('Error deleting payment:', error);
			res.status(500).json({ error: 'Failed to delete payment' });
		}
	}

	static async setDefaultPayment(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return res.status(401).json({ message: 'User not authenticated' });
			}

			const paymentId = req.params.id;
			if (!paymentId) {
				return res.status(400).json({ message: 'Payment ID is required' });
			}

			const mongo = MongoConn.getInstance();
			if (!mongo.notAirBnbDB) {
				throw new Error('Database connection not established');
			}

			// First, unset default flag for all user's payment methods
			await mongo.notAirBnbDB.collection('payments').updateMany(
				{ userId: userId },
				{ $set: { isDefault: false } }
			);

			// Set the specified payment method as default
			const result = await mongo.notAirBnbDB.collection('payments').updateOne(
				{ _id: new ObjectId(paymentId), userId: userId },
				{ $set: { isDefault: true } }
			);

			if (result.matchedCount === 0) {
				return res.status(404).json({ message: 'Payment method not found' });
			}

			res.json({ message: 'Default payment method updated successfully' });
		} catch (error) {
			console.error('Error setting default payment method:', error);
			res.status(500).json({ message: 'Error setting default payment method' });
		}
	}
}

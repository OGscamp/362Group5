import * as express from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { ObjectId } from 'mongodb';
import { Payment } from './payment-model';

export class PaymentController {
	static async createPayment(req: express.Request, res: express.Response): Promise<void> {
		try {
		  const userId = (req as any).user?.username;
		  const {
			amount,
			method,
			status,
			cardNumber,
			cardHolder,
			expiryDate,
			cvv
		  } = req.body;
	  
		  const timestamp = new Date().toISOString();
	  
		  const payment: Payment = {
			userId,
			amount,
			method,
			status,
			timestamp,
			cardNumber,
			cardHolder,
			expiryDate,
			cvv
		  };
	  
		  const mongo = MongoConn.getInstance();
		  const collection = mongo.notAirBnbDB.db("notairbnb").collection<Payment>('payments');
	  
		  const result = await collection.insertOne(payment);
		  res.status(201).json({ message: 'Payment recorded', id: result.insertedId });
		} catch (error) {
		  console.error('Error creating payment:', error);
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  }

  static async getPayments(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = (req as any).user?.username;
      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db("notairbnb").collection<Payment>('payments');

      const payments = await collection.find({ userId }).toArray();
      res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deletePayment(req: express.Request, res: express.Response): Promise<void> {
	try {
	  const userId = (req as any).user?.username;
	  const { id } = req.params;
  
	  const mongo = MongoConn.getInstance();
	  const collection = mongo.notAirBnbDB.db("notairbnb").collection('payments');
  
	  const result = await collection.deleteOne({
		_id: new ObjectId(id),
		userId: userId
	  });
  
	  if (result.deletedCount === 0) {
		res.status(404).json({ error: 'Payment not found or not authorized' });
		return;
	  }
  
	  res.status(200).json({ message: 'Payment deleted', id });
	} catch (error) {
	  console.error('Error deleting payment:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  }

}

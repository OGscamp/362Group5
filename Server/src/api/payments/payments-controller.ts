import { Request, Response } from 'express';
import { getDb } from '../../utilities/mongo';

export class PaymentsController {
  static async addPaymentMethod(req: Request, res: Response) {
    try {
      const db = await getDb();
      const formData = req.body;
      
      // Just save whatever data was sent
      await db.collection('forms').insertOne({
        ...formData,
        createdAt: new Date()
      });

      res.status(200).json({ 
        message: 'Form saved successfully',
        data: formData
      });
    } catch (error) {
      console.error('Error saving form:', error);
      res.status(500).json({ error: 'Failed to save form' });
    }
  }

  static async getPaymentMethods(req: Request, res: Response) {
    try {
      const db = await getDb();
      const forms = await db.collection('forms').find().toArray();
      res.status(200).json({ forms });
    } catch (error) {
      console.error('Error getting forms:', error);
      res.status(500).json({ error: 'Failed to get forms' });
    }
  }
} 
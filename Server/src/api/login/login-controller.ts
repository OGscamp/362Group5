import * as express from 'express';
import { MongoConn } from '../../utilities/mongo-connect';

export class LoginController {
  static async register(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const mongo = MongoConn.getInstance();
      const users = mongo.notAirBnbDB.db('notairbnb').collection('users');

      const existingUser = await users.findOne({ username });
      if (existingUser) {
        res.status(409).json({ error: 'Username already taken' });
      }

      await users.insertOne({ username, password });
      res.status(201).json({ message: 'Account created successfully' });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deleteUser(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { username } = req.body;
      const mongo = MongoConn.getInstance();
      const users = mongo.notAirBnbDB.db('notairbnb').collection('users');

      const result = await users.deleteOne({ username });
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Delete error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updatePassword(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { username, newPassword } = req.body;
      const mongo = MongoConn.getInstance();
      const users = mongo.notAirBnbDB.db('notairbnb').collection('users');

      const result = await users.updateOne(
        { username },
        { $set: { password: newPassword } }
      );

      if (result.matchedCount === 0) {
        res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'Password updated' });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}


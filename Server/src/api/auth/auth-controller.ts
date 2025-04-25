import { Request, Response } from 'express';
import { getDb } from '../../utilities/mongo';
import { Session } from 'express-session';

interface CustomRequest extends Request {
  session: Session & {
    user?: {
      username: string;
    };
  };
}

export class AuthController {
  static async login(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const db = await getDb();
      const user = await db.collection('users').findOne({ username, password });

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Set session
      req.session.user = { username };
      res.json({ message: 'Logged in successfully', user: { username } });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const db = await getDb();

      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ username });
      if (existingUser) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }

      // Create new user
      await db.collection('users').insertOne({ username, password });
      res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register' });
    }
  }

  static async logout(req: CustomRequest, res: Response): Promise<void> {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          res.status(500).json({ error: 'Failed to logout' });
          return;
        }
        res.json({ message: 'Logged out successfully' });
      });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'Failed to logout' });
    }
  }

  static async getCurrentUser(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (!req.session.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { username } = req.session.user;
      const db = await getDb();
      const user = await db.collection('users').findOne({ username });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ username: user.username });
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ error: 'Failed to get current user' });
    }
  }
} 
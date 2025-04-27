import { Request, Response } from 'express';
import { getDb } from '../../utilities/mongo';
import { Session } from 'express-session';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';


interface CustomRequest extends Request {
  session: Session & {
    user?: {
      username: string;
    };
  };
}

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      console.log('Login attempt:', { username, password });
      
      if (!username || !password) {
        console.log('Missing credentials');
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const db = await getDb();
      // Print all users for debugging
      const allUsers = await db.collection('users').find({}).toArray();
      console.log('All users in DB:', allUsers);
      console.log('Searching for user:', username);
      const user = await db.collection('users').findOne({ username, password });
      console.log('Found user:', user);

      if (!user) {
        console.log('Invalid credentials');
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('Login successful, sending response');
      res.json({ 
        success: true,
        message: 'Login successful', 
        token,
        user: { 
          _id: user._id,
          username: user.username 
        } 
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to login',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
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
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
          // Verify token to get user ID
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
          if (decoded && decoded.userId) {
        const db = await getDb();
            // Update user document to remove any session-related data
        await db.collection('users').updateOne(
              { _id: new ObjectId(decoded.userId) },
          { $unset: { sessionId: "" } }
        );
          }
        }
      }

      // Clear the session
      if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
            res.status(500).json({ 
              success: false,
              error: 'Failed to destroy session',
              details: err.message 
            });
          return;
        }
          res.json({ 
            success: true,
            message: 'Logged out successfully' 
          });
      });
      } else {
        res.json({ 
          success: true,
          message: 'Logged out successfully' 
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to logout',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      // req.user is set by Auth.verifyUser middleware
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      res.json(req.user);
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ error: 'Failed to get current user' });
    }
  }
} 
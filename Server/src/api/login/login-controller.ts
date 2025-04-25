import { Request, Response } from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export class LoginController {
  static async login(req: Request, res: Response) {
    try {
      console.log('Attempting login...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      const { username, password } = req.body;
      console.log('Login attempt for username:', username);
      
      if (!username || !password) {
        console.log('Missing username or password');
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const users = mongo.notAirBnbDB.collection('users');
      const user = await users.findOne({ username, password });
      
      if (!user) {
        console.log('Invalid username or password');
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      // Generate JWT token with username
      const token = jwt.sign(
        { userId: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Remove password from response and ensure username is included
      const { password: _, ...userWithoutPassword } = user;
      const userResponse = {
        ...userWithoutPassword,
        username: user.username // Ensure username is included
      };
      
      console.log('Login successful for user:', username);
      res.json({
        message: 'Login successful',
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      console.log('Attempting registration...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const users = mongo.notAirBnbDB.collection('users');
      
      // Check if username already exists
      const existingUser = await users.findOne({ username });
      if (existingUser) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }

      const newUser = {
        username,
        password
      };

      const result = await users.insertOne(newUser);
      
      console.log('Registration successful for username:', username);
      res.json({
        success: true,
        user: {
          _id: result.insertedId,
          username
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      console.log('Logging out user...');
      // Clear the token cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      res.json({ 
        message: 'Logged out successfully',
        success: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      console.log('Getting current user...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      // Get user from request (set by auth middleware)
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const users = mongo.notAirBnbDB.collection('users');
      const currentUser = await users.findOne({ _id: user._id });
      
      if (!currentUser) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = currentUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}


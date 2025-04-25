// let passport = require('passport');
// import { Strategy as CustomStrategy } from 'passport-custom';
// import { MongoConn } from './mongo-connect';

// // passport not getting called for atuhentication
// passport.use(new CustomStrategy(async (req, done) => {
//     const { username, password } = req.body;
  
//     try {
//       const mongo = MongoConn.getInstance();
//       const users = mongo.notAirBnbDB.db('notairbnb').collection('users');
//       const user = await users.findOne({ username });
  
//       if (!user || user.password !== password) {
//         return done(null, false);
//       }
  
//       done(null, { username: user.username, action: 'createCookie' });
//     } catch (err) {
//       console.error('Auth error:', err);
//       done(err);
//     }
//   }));

// passport.protected = (req, res, next) => {
//     //if (req.isAuthenticated()){
//     if (req.cookies && req.cookies.path_authorized){
//         return next();
//     } else {
// 		// this aussumes that the user does not have the right cookies so they go to login page
//         res.status(401).json({ error: 'Unauthorized' });
//         //res.redirect('/login');
//         //return next();
//     }
// }

// passport.serializeUser(function(user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//     done(null, user);
// });


// export let Auth = passport;
// export default passport;
import { Request, Response, NextFunction } from 'express';
import { MongoConn } from './mongo-connect';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export class Auth {
  static async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Verifying user...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        console.log('Decoded token:', decoded);
        
        const users = mongo.notAirBnbDB.collection('users');
        const user = await users.findOne({ username: decoded.userId });
        
        if (!user) {
          res.status(401).json({ error: 'User not found' });
          return;
        }

        // Attach user to request with username
        req.user = {
          ...user,
          username: user.username
        };
        console.log('User attached to request:', req.user);
        next();
      } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async verifyAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Verifying admin...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        
        const users = mongo.notAirBnbDB.collection('users');
        const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
        
        if (!user) {
          res.status(401).json({ error: 'User not found' });
          return;
        }

        if (!user.isAdmin) {
          res.status(403).json({ error: 'Not authorized as admin' });
          return;
        }

        // Attach user to request
        req.user = user;
        next();
      } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      console.error('Error verifying admin:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

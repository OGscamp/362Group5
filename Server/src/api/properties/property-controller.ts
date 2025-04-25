import * as express from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { ObjectId } from 'mongodb';
import { Auth } from '../../utilities/auth';
import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';
import cloudinary from '../../utilities/cloudinary';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Extend Express Request type to include files
declare global {
  namespace Express {
    interface Request {
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined;
    }
  }
}

interface Property {
  _id?: ObjectId;
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  photos: string[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionData {
  username?: string;
}

export class PropertyController {
  static async getAllProperties(req: Request, res: Response) {
    try {
      console.log('Fetching all properties...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      const properties = mongo.notAirBnbDB.collection('properties');
      const allProperties = await properties.find({}).toArray();
      
      console.log(`Found ${allProperties.length} properties`);
      res.json(allProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getPropertyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`Fetching property with ID: ${id}`);
      
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      const properties = mongo.notAirBnbDB.collection('properties');
      const property = await properties.findOne({ _id: new ObjectId(id) });
      
      if (!property) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      console.log('Property found:', property);
      res.json(property);
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async createProperty(req: Request, res: Response) {
    try {
      console.log('Creating new property...');
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      const { title, description, price, location, username } = req.body;
      
      if (!title || !description || !price || !location || !username) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const properties = mongo.notAirBnbDB.collection('properties');
      
      const newProperty = {
        title,
        description,
        price: Number(price),
        location,
        photos: [], // Will be updated after file upload
        userId: username, // Directly use the username from request
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Inserting new property:', newProperty);
      const result = await properties.insertOne(newProperty);
      
      // Handle file uploads if any
      if (req.files && Array.isArray(req.files)) {
        const photoUrls = await Promise.all(
          (req.files as Express.Multer.File[]).map(async (file) => {
            const result = await cloudinary.uploader.upload(file.buffer.toString('base64'), {
              folder: 'not-airbnb/properties'
            });
            return {
              url: result.secure_url,
              publicId: result.public_id
            };
          })
        );

        // Update property with photo URLs
        await properties.updateOne(
          { _id: result.insertedId },
          { $set: { photos: photoUrls } }
        );
      }
      
      console.log('Property created successfully:', result.insertedId);
      res.status(201).json({ 
        ...newProperty, 
        _id: result.insertedId,
        photos: newProperty.photos
      });
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updateProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`Updating property with ID: ${id}`);
      
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

      const properties = mongo.notAirBnbDB.collection('properties');
      const property = await properties.findOne({ _id: new ObjectId(id) });
      
      if (!property) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      // Check if user is authorized to update this property
      if (property.userId !== user.username) {
        res.status(403).json({ error: 'Not authorized to update this property' });
        return;
      }

      const { title, description, price, location, photos } = req.body;
      const updateData = {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(location && { location }),
        ...(photos && { photos }),
        updatedAt: new Date()
      };

      const result = await properties.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      console.log('Property updated successfully');
      res.json(result);
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async deleteProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`Deleting property with ID: ${id}`);
      
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

      const properties = mongo.notAirBnbDB.collection('properties');
      const property = await properties.findOne({ _id: new ObjectId(id) });
      
      if (!property) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      // Check if user is authorized to delete this property
      if (property.userId !== user.username) {
        res.status(403).json({ error: 'Not authorized to delete this property' });
        return;
      }

      // Delete the property
      const result = await properties.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      console.log('Property deleted successfully');
      res.status(200).json({ 
        message: 'Property deleted successfully',
        success: true 
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async searchProperties(req: Request, res: Response) {
    try {
      console.log('Searching properties...');
      const { query, minPrice, maxPrice, location } = req.query;
      
      const mongo = MongoConn.getInstance();
      await mongo.waitForDB();
      
      if (!mongo.notAirBnbDB) {
        throw new Error('Database connection not established');
      }

      const properties = mongo.notAirBnbDB.collection('properties');
      
      const searchQuery: any = {};
      
      if (query) {
        searchQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }
      
      if (location) {
        searchQuery.location = { $regex: location, $options: 'i' };
      }
      
      if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) searchQuery.price.$gte = Number(minPrice);
        if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
      }

      const results = await properties.find(searchQuery).toArray();
      console.log(`Found ${results.length} properties matching search criteria`);
      res.json(results);
    } catch (error) {
      console.error('Error searching properties:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updatePropertyPhotos(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`Updating photos for property with ID: ${id}`);
      
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

      const properties = mongo.notAirBnbDB.collection('properties');
      const property = await properties.findOne({ _id: new ObjectId(id) });
      
      if (!property) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      // Check if user is authorized to update this property
      if (property.userId !== user.username) {
        res.status(403).json({ error: 'Not authorized to update this property' });
        return;
      }

      const photos = req.files as Express.Multer.File[];
      if (!photos || photos.length === 0) {
        res.status(400).json({ error: 'No photos provided' });
        return;
      }

      // Upload photos to Cloudinary and get URLs
      const photoUrls = await Promise.all(
        photos.map(async (photo) => {
          const result = await cloudinary.uploader.upload(photo.path, {
            folder: 'not-airbnb/properties'
          });
          return {
            url: result.secure_url,
            publicId: result.public_id
          };
        })
      );

      const result = await properties.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            photos: photoUrls,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );

      if (!result) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      console.log('Property photos updated successfully');
      res.json(result);
    } catch (error) {
      console.error('Error updating property photos:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getPropertiesByUserId(req: Request, res: Response) {
    try {
      console.log('Getting properties by user ID...');
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

      const properties = mongo.notAirBnbDB.collection('properties');
      const userProperties = await properties.find({ userId: user.email }).toArray(); // Changed from owner to userId with email
      
      console.log(`Found ${userProperties.length} properties for user ${user.email}`);
      res.json(userProperties);
    } catch (error) {
      console.error('Error getting user properties:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 
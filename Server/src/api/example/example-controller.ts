import * as express from 'express';
import { ObjectId } from 'mongodb';
import { MongoConn } from '../../utilities/mongo-connect';

export class ExampleController {
  public static async getExample(req: express.Request, res: express.Response): Promise<void> {

    try {
      let mongo = MongoConn.getInstance();
      if (mongo.notAirBnbDB) {
        // Perform MongoDB operations here
        // Example: Fetch data from a collection
        const collection = mongo.notAirBnbDB.db("notairbnb").collection('example');

        //Fetch all documents from the collection
        // Currently, this is a placeholder for the actual data fetching logic. It just finds everything ask chat how to do this differently
        const data = await collection.find({}).toArray();
        
        console.log('Fetched data:', data);
        res.status(200).json(data);
        

      } else {
        console.error('MongoDB connection is not established.');
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

    } catch (error) {
      console.error('Error fetching example data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public static async postExample(req: express.Request, res: express.Response): Promise<void> {
    try {
      // Assuming the request body contains the data to be saved
      const requestData = req.body;
      console.log('Received data:', requestData);


      // get mongo connection
      let mongo = MongoConn.getInstance();

      // Check if the MongoDB connection is established
      if (mongo.notAirBnbDB) {
        // Example: Save data to a collection

        const collection = mongo.notAirBnbDB.db("notairbnb").collection('example');
        await collection.insertOne(requestData);
      }

      res.status(201).json({ message: 'Data saved successfully', data: requestData });
    } catch (error) {
      console.error('Error saving example data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

    // make an update function that updates a document in the example collection
    public static async updateExample(req: express.Request, res: express.Response): Promise<void> {
      try {
        const { id } = req.params;
        const updateData = req.body;
  
        let mongo = MongoConn.getInstance();
        if (mongo.notAirBnbDB) {
          const collection = mongo.notAirBnbDB.db("notairbnb").collection('example');
          const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
          );
  
          if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Document not found' });
          }
  
          res.status(200).json({ message: 'Document updated successfully' });
        } else {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } catch (error) {
        console.error('Error updating example data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    // make a delete function that deletes a document in the example collection
    public static async deleteExample(req: express.Request, res: express.Response): Promise<void> {
      try {
        const { id } = req.params;
  
        let mongo = MongoConn.getInstance();
        if (mongo.notAirBnbDB) {
          const collection = mongo.notAirBnbDB.db("notairbnb").collection('example');
          const result = await collection.deleteOne({ _id: new ObjectId(id) });
  
          if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Document not found' });
          }
  
          res.status(200).json({ message: 'Document deleted successfully' });
        } else {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } catch (error) {
        console.error('Error deleting example data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}
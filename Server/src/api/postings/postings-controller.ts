// src/api/postings/posting-controller.ts

import * as express from 'express';

export class PostingController {
  // Get all postings
  static async getPostings(req: express.Request, res: express.Response): Promise<void> {
    try {
      // Example: Fetch postings from a database or mock data
      const postings = [{ id: 1, title: 'First Posting' }, { id: 2, title: 'Second Posting' }];
      res.status(200).json(postings);
    } catch (error) {
      console.error('Error fetching postings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Create a new posting
  static async createPosting(req: express.Request, res: express.Response): Promise<void> {
    try {
      const newPosting = req.body;  // Assuming you send the posting details in the request body
      // Example: Save the new posting to a database
      console.log('New Posting:', newPosting);
      res.status(201).json({ message: 'Posting created', posting: newPosting });
    } catch (error) {
      console.error('Error creating posting:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Delete a posting
  static async deletePosting(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { id } = req.params;  // Get the posting ID from the URL parameters
      // Example: Delete the posting from the database
      console.log(`Deleting posting with ID: ${id}`);
      res.status(200).json({ message: 'Posting deleted', id });
    } catch (error) {
      console.error('Error deleting posting:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

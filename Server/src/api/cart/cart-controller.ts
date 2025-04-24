import * as express from 'express';
import { MongoConn } from '../../utilities/mongo-connect';
import { Cart, CartItem } from './cart-model';

export class CartController {
  static async getCart(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = (req as any).user?.username;
      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db("notairbnb").collection<Cart>('cart');

      const cart = await collection.findOne({ userId });
      res.status(200).json(cart || { userId, items: [] });
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async addToCart(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = (req as any).user?.username;
      const item: CartItem = req.body.item;

      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db("notairbnb").collection<Cart>('cart');

      let result = await collection.updateOne(
        { userId },
        { $push: { items: item } },
        { upsert: true }
      );

      res.status(201).json({ message: 'Item added to cart', _id: result.upsertedId });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async removeFromCart(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = (req as any).user?.username;
      const itemId: string = req.body.itemId;

      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db("notairbnb").collection<Cart>('cart');

      let result = await collection.updateOne(
        { userId },
        { $pull: { items: { id: itemId } } }
      );

      // Check if the item was found and removed
      if (result.modifiedCount === 0) {
        res.status(404).json({ error: 'Item not found in cart' });
        return;
      }

      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async clearCart(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = (req as any).user?.username;
      const mongo = MongoConn.getInstance();
      const collection = mongo.notAirBnbDB.db("notairbnb").collection<Cart>('cart');

      await collection.updateOne(
        { userId },
        { $set: { items: [] } }
      );

      res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

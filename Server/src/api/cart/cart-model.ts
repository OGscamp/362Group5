// Represents a single item inside the user's cart
export interface CartItem {
	// Unique identifier for the item (e.g., a listing ID or product ID)
	id: string;
  
	// The name/title of the item being added to the cart
	title: string;
  
	// The price of this item (usually per night, per unit, etc.)
	price: number;
  }
  
  // Represents the entire cart belonging to a single user
  export interface Cart {
	// The ID of the user who owns this cart
	userId: string;
  
	// An array of items that this user has added to their cart
	items: CartItem[];
  }

  // for testing on postman 
  /*
{
  "userId": "user123",
  "item": {
    "id": "listing001",
    "title": "Beach House",
    "price": 220,
    "quantity": 1
  }
}
  */
export interface Review {
    id: string;           // Unique identifier for the review
    postingId: string;    // ID of the posting
    userId: string;       // ID of the user
    comment: string;      // The review comment
    rating: number;       // Rating (from 1 to 5 stars?)
    createdAt: Date;      // Timestamp when review was made
  }
  
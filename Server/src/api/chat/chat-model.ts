export interface ChatMessage {
	userId: string;          // sender
	recipientId: string;     // receiver
	message: string;
	timestamp: string;       // ISO string
  }
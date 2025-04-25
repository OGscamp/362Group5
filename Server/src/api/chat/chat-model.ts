import { ObjectId } from 'mongodb';

export interface ChatMessage {
	_id?: ObjectId;
	senderId: ObjectId;
	receiverId: ObjectId;
	message: string;
	timestamp: Date;
	read: boolean;
}
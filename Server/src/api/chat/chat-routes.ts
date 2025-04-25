import * as express from 'express';
import { ChatController } from './chat-controller';
import { Auth } from '../../utilities/auth';

export class ChatRoutes {
  static init(router: express.Router) {
    router.post('/api/chat/send', Auth.verifyUser, ChatController.sendMessage);
    router.get('/api/chat/history/:otherUserId', Auth.verifyUser, ChatController.getMessages);
    router.get('/api/chat/unread', Auth.verifyUser, ChatController.getUnreadCount);
  }
}

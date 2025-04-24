import * as express from 'express';
import { ChatController } from './chat-controller';
import { Auth } from '../../utilities/auth';

export class ChatRoutes {
  static init(router: express.Router) {
    router.post('/api/chat/send', Auth.protected, ChatController.sendMessage);
    router.get('/api/chat/history', Auth.protected, ChatController.getChatHistory);
  }
}

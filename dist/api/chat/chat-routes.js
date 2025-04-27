"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const chat_controller_1 = require("./chat-controller");
const auth_1 = require("../../utilities/auth");
class ChatRoutes {
    static init(router) {
        router.post('/api/chat/send', auth_1.Auth.verifyUser, chat_controller_1.ChatController.sendMessage);
        router.get('/api/chat/history/:otherUserId', auth_1.Auth.verifyUser, chat_controller_1.ChatController.getMessages);
        router.get('/api/chat/unread', auth_1.Auth.verifyUser, chat_controller_1.ChatController.getUnreadCount);
    }
}
exports.ChatRoutes = ChatRoutes;
//# sourceMappingURL=chat-routes.js.map
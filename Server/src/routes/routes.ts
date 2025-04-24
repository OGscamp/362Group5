import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

import { ExampleRoutes } from '../api/example/example-routes';
import { LoginRoutes } from '../api/login/login-routes';
import { CartRoutes } from '../api/cart/cart-routes';
import { PostingRoutes } from '../api/postings/postings-routes';
import { ReviewRoutes } from '../api/review/review-routes';
import { ChatRoutes } from '../api/chat/chat-routes';
import { PaymentRoutes } from '../api/payment/payment-routes';
import { randomUUID } from 'crypto';

export class Routes {
  static init(app: express.Application, router: express.Router) {
    const passport = require('passport');

    // ✅ Enable cookie parsing BEFORE session & passport
    app.use(cookieParser());

    // ✅ Parse incoming JSON bodies
    app.use(express.json());

    // ✅ Session middleware
    app.use(session({
      resave: true,
      saveUninitialized: false,
      secret: randomUUID(),
      cookie: {
        maxAge: 2678400000, // 31 days
        httpOnly: true
      },
    }));

    // ✅ Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // ✅ Initialize routes
    ExampleRoutes.init(router);
    LoginRoutes.init(router);
    CartRoutes.init(router);
    PostingRoutes.init(router);
    PaymentRoutes.init(router);
    ChatRoutes.init(router);
    ReviewRoutes.init(router);

    // ✅ Mount router
    app.use('/', router);

    // ✅ Start the server
  
  }
}

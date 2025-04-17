// import * as express from 'express';
// import * as session from 'express-session';
// import * as cookieParser from 'cookie-parser';

// import { ExampleRoutes } from '../api/example/example-routes';
// import { LoginRoutes } from '../api/login/login-routes';
// import { CartRoutes } from '../api/cart/cart-routes';
// import { randomUUID } from 'crypto';

// export class Routes { 
//     static init(app: express.Application, router: express.Router) {
//         //port for the server to run on
//         const PORT = "3000";
//         let passport = require('passport');
        
//         app.use(session({
//             resave: true,
//             saveUninitialized: false,
//             secret: randomUUID(),
//             cookie: {
//                 maxAge: 2678400000, // 31 days
//                 httpOnly: true
//             },
//         }));

//         //initialize passport
// 		app.use(passport.initialize());
//         app.use(passport.session());


// 		// path to client FETCHING THE REACT STUFF
//         //app.use(express.static("/client/"));

//         app.use(express.json());

//         app.listen(PORT, () => console.log(`NotAirBnb listening on port ${PORT}!`));

//         app.use(cookieParser()); 
//         app.use(express.json());

//         ExampleRoutes.init(router);
// 		LoginRoutes.init(router);
//         CartRoutes.init(router);
//         // Bryant
//         // PostingsRoutes.init(router);
//         // Ribeka  
//         // ReviewsRoutes.init(router);
//         // chatRoutes.init(router);
//         // PaymentRoutes.init(router);

//         app.use('/', router);
//     }
// }

import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

import { ExampleRoutes } from '../api/example/example-routes';
import { LoginRoutes } from '../api/login/login-routes';
import { CartRoutes } from '../api/cart/cart-routes';
import { randomUUID } from 'crypto';

export class Routes {
  static init(app: express.Application, router: express.Router) {
    const PORT = "3000";
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

    // ✅ Mount router
    app.use('/', router);

    // ✅ Start the server
    app.listen(PORT, () => console.log(`NotAirBnb listening on port ${PORT}!`));
  }
}

import * as express from 'express';
import * as session from 'express-session';

import { ExampleRoutes } from '../api/example/example-routes';
import { LoginRoutes } from '../api/login/login-routes';
import { randomUUID } from 'crypto';

export class Routes { 
    static init(app: express.Application, router: express.Router) {
        //port for the server to run on
        const PORT = "3000";
        let passport = require('passport');
        
        app.use(session({
            resave: true,
            saveUninitialized: false,
            secret: randomUUID(),
            cookie: {
                maxAge: 2678400000, // 31 days
                httpOnly: true
            },
        }));

        //initialize passport
		app.use(passport.initialize());
        app.use(passport.session());


		// path to client FETCHING THE REACT STUFF
        //app.use(express.static("/client/"));

        app.use(express.json());

        app.listen(PORT, () => console.log(`NotAirBnb listening on port ${PORT}!`));

        ExampleRoutes.init(router);
		LoginRoutes.init(router);

        app.use('/', router);
    }
}
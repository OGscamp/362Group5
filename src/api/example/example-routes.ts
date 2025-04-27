import * as express from 'express';
import { ExampleController } from './example-controller';
import { Auth } from '../../utilities/auth';

// get meants get stuff from the server, post means send stuff to the server

export class ExampleRoutes {
    static init(router: express.Router) {
        router.route('/api/example')
        .get(ExampleController.getExample)
        .post(ExampleController.postExample);
        
        router.route('/api/example2').get(Auth.verifyUser, ExampleController.getExample);

        router.route('/api/example/:id')
        .put(ExampleController.updateExample)
        .delete(ExampleController.deleteExample);
    }
}
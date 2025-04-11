import * as express	from 'express';
import { Routes } from './routes/routes';
import { MongoConn } from './utilities/mongo-connect';

//get mongodb connection
let mongoConn: MongoConn = MongoConn.getInstance();


//wait for mongo connection
let timer = setInterval(() => {
    //check if mongo connection is established
    if((mongoConn.notAirBnbDB)){

        //if mongo connection is established, clear the interval (stops the loop)
        clearInterval(timer);

        //start the server
        const app = express();
        Routes.init(app, express.Router());

    } else {
        console.log("Waiting for MongoDB connection...");
    }
}, 500);

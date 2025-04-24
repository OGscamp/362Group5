import * as express	from 'express';
import { Routes } from './routes/routes';
import { MongoConn } from './utilities/mongo-connect';

export const app = express();
export async function init(isTest: boolean = false): Promise<void> {
	//get mongodb connection
	let mongoConn: MongoConn = MongoConn.getInstance(isTest);
	await mongoConn.waitForDB();
	Routes.init(exports.app, express.Router());
}
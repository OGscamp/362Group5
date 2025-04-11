import * as express from 'express';
import { userinfoModel } from './login-model';

export class LoginController {	
	public static async login(req: express.Request, res: express.Response): Promise<void> {
		try {
			// let data: userinfoModel;
			// data.username = req.body.username;
			
			
			const exampleData = { message: 'Todo: login!' };
			res.status(200).json(exampleData);
		} catch (error) {
			console.error('Error fetching example data:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}

    public static async pressLogin(req: express.Request, res: express.Response): Promise<void> {
		try {
			// let data: userinfoModel;
			// data.username = req.body.username;
			
			
			const exampleData = { message: 'Todo: login!' };
			res.status(200).json(exampleData);
		} catch (error) {
			console.error('Error fetching example data:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
}
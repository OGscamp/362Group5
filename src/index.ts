import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoConn } from './utilities/mongo-connect';
import { setupRoutes } from './routes/routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
	origin: ['https://elaborate-yeot-7e93c3.netlify.app', 'http://localhost:5173'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Setup routes
setupRoutes(app);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Connect to MongoDB
MongoConn.getInstance().connect()
	.then(() => {
		console.log('Connected to MongoDB');
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error('Failed to start server:', error);
		process.exit(1);
	});
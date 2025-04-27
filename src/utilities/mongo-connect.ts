import { MongoClient, Db } from 'mongodb';

export class MongoConn {
    private static instance: MongoConn;
    private client: MongoClient | null = null;
    public notAirBnbDB: Db | null = null;
    private connectionString: string;
    private retryCount = 0;
    private maxRetries = 5;
    private retryDelay = 5000; // 5 seconds

    private constructor() {
        this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/notairbnb';
        console.log('Initializing MongoDB connection...');
        console.log('Using connection string:', this.connectionString.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
    }

    public static getInstance(): MongoConn {
        if (!MongoConn.instance) {
            MongoConn.instance = new MongoConn();
        }
        return MongoConn.instance;
    }

    public async connect(): Promise<void> {
        try {
            console.log('Attempting to connect to MongoDB...');
            this.client = new MongoClient(this.connectionString, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 10000,
                maxPoolSize: 10,
                minPoolSize: 5
            });
            
            // Add event listeners for connection events
            this.client.on('connected', () => {
                console.log('MongoDB connected successfully');
                this.retryCount = 0; // Reset retry count on successful connection
            });

            this.client.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            this.client.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });

            await this.client.connect();
            this.notAirBnbDB = this.client.db('notairbnb');
            
            // Verify collections exist
            const collections = await this.notAirBnbDB.listCollections().toArray();
            console.log('Available collections:', collections.map(c => c.name));
            
            // Create collections if they don't exist
            const requiredCollections = ['properties', 'users', 'bookings', 'reviews'];
            for (const collectionName of requiredCollections) {
                if (!collections.some(c => c.name === collectionName)) {
                    console.log(`Creating collection: ${collectionName}`);
                    await this.notAirBnbDB.createCollection(collectionName);
                }
            }
            
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`Retrying connection in ${this.retryDelay/1000} seconds... (Attempt ${this.retryCount}/${this.maxRetries})`);
                setTimeout(() => this.connect(), this.retryDelay);
            } else {
                throw new Error('Max retry attempts reached. Could not connect to MongoDB.');
            }
        }
    }

    public async waitForDB(): Promise<void> {
        if (!this.notAirBnbDB) {
            console.log('Database not connected, attempting to connect...');
            await this.connect();
        }
    }

    public async close(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.notAirBnbDB = null;
        }
    }
}

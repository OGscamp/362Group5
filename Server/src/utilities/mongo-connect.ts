import { MongoClient } from "mongodb";

export class MongoConn {

    public notAirBnbDB:MongoClient | null = null;

    private static instance: MongoConn;

    private constructor() {
        if (MongoConn.instance) {
            throw new Error('Use MongoConn.getInstance instead');
        }
        MongoConn.instance = this;

        this.init();
    }

    
    public static getInstance() {
        if (!MongoConn.instance) {
            MongoConn.instance = new MongoConn();
        }
        return MongoConn.instance;
    }

    private async init() {
        // Connection URL
        // protocol://host:port/database
        const connectionString = "mongodb://mongodb:27017/notairbnb";
        const client = new MongoClient(connectionString);

        try {
            this.notAirBnbDB = await client.connect();
        } catch(e) {
            console.error(e);
        }

        this.notAirBnbDB.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        this.notAirBnbDB.once('open', () => {  
            console.log('MongoDB connection established');
        });

    }
}

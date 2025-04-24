import { MongoClient } from "mongodb";
import { resolve } from "path";

export class MongoConn {

    public notAirBnbDB:MongoClient | null = null;

    private static instance: MongoConn;

    private constructor(isTest: boolean = false) {
        if (MongoConn.instance) {
            throw new Error('Use MongoConn.getInstance instead');
        }
        MongoConn.instance = this;

        this.init(isTest);
    }

    
    public static getInstance(isTest: boolean = false): MongoConn {
        if (!MongoConn.instance) {
            MongoConn.instance = new MongoConn(isTest);
        }
        return MongoConn.instance;
    }

    public async waitForDB(): Promise<Boolean> {
        return new Promise((resolve) => {
            let timer = setInterval(() => {
                //check if mongo connection is established
                if (this.notAirBnbDB) {
                    //if mongo connection is established, clear the interval (stops the loop)
                    clearInterval(timer);
                    resolve(true);
                } else {
                    console.log("Waiting for MongoDB connection...");
                }
            }, 500);
        });
    }

    private async init(isTest: boolean = false) {
        // Connection URL
        // protocol://host:port/database
        let connectionString = "mongodb://mongodb:27017/notairbnb";
        if(isTest) connectionString = "mongodb://localhost:27017/notairbnb";
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

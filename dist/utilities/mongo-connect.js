"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConn = void 0;
const mongodb_1 = require("mongodb");
class MongoConn {
    constructor() {
        this.client = null;
        this.notAirBnbDB = null;
        this.retryCount = 0;
        this.maxRetries = 5;
        this.retryDelay = 5000; // 5 seconds
        this.connectionString = process.env.MONGODB_URI || 'mongodb+srv://your-production-mongodb-uri/notairbnb';
        console.log('Initializing MongoDB connection...');
        console.log('Using connection string:', this.connectionString.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
    }
    static getInstance() {
        if (!MongoConn.instance) {
            MongoConn.instance = new MongoConn();
        }
        return MongoConn.instance;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Attempting to connect to MongoDB...');
                this.client = new mongodb_1.MongoClient(this.connectionString, {
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
                yield this.client.connect();
                this.notAirBnbDB = this.client.db('notairbnb');
                // Verify collections exist
                const collections = yield this.notAirBnbDB.listCollections().toArray();
                console.log('Available collections:', collections.map(c => c.name));
                // Create collections if they don't exist
                const requiredCollections = ['properties', 'users', 'bookings', 'reviews'];
                for (const collectionName of requiredCollections) {
                    if (!collections.some(c => c.name === collectionName)) {
                        console.log(`Creating collection: ${collectionName}`);
                        yield this.notAirBnbDB.createCollection(collectionName);
                    }
                }
            }
            catch (error) {
                console.error('Failed to connect to MongoDB:', error);
                if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    console.log(`Retrying connection in ${this.retryDelay / 1000} seconds... (Attempt ${this.retryCount}/${this.maxRetries})`);
                    setTimeout(() => this.connect(), this.retryDelay);
                }
                else {
                    throw new Error('Max retry attempts reached. Could not connect to MongoDB.');
                }
            }
        });
    }
    waitForDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.notAirBnbDB) {
                console.log('Database not connected, attempting to connect...');
                yield this.connect();
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client) {
                yield this.client.close();
                this.client = null;
                this.notAirBnbDB = null;
            }
        });
    }
}
exports.MongoConn = MongoConn;
//# sourceMappingURL=mongo-connect.js.map
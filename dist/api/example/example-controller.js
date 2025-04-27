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
exports.ExampleController = void 0;
const mongodb_1 = require("mongodb");
const mongo_connect_1 = require("../../utilities/mongo-connect");
class ExampleController {
    static getExample(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let mongo = mongo_connect_1.MongoConn.getInstance();
                if (mongo.notAirBnbDB) {
                    // Perform MongoDB operations here
                    // Example: Fetch data from a collection
                    const collection = mongo.notAirBnbDB.collection('example');
                    //Fetch all documents from the collection
                    // Currently, this is a placeholder for the actual data fetching logic. It just finds everything ask chat how to do this differently
                    const data = yield collection.find({}).toArray();
                    console.log('Fetched data:', data);
                    res.status(200).json(data);
                }
                else {
                    console.error('MongoDB connection is not established.');
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
            }
            catch (error) {
                console.error('Error fetching example data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static postExample(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Assuming the request body contains the data to be saved
                const requestData = req.body;
                console.log('Received data:', requestData);
                // get mongo connection
                let mongo = mongo_connect_1.MongoConn.getInstance();
                // Check if the MongoDB connection is established
                if (mongo.notAirBnbDB) {
                    // Example: Save data to a collection
                    const collection = mongo.notAirBnbDB.collection('example');
                    yield collection.insertOne(requestData);
                }
                res.status(201).json({ message: 'Data saved successfully', data: requestData });
            }
            catch (error) {
                console.error('Error saving example data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // make an update function that updates a document in the example collection
    static updateExample(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updateData = req.body;
                let mongo = mongo_connect_1.MongoConn.getInstance();
                if (mongo.notAirBnbDB) {
                    const collection = mongo.notAirBnbDB.collection('example');
                    const result = yield collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData });
                    if (result.matchedCount === 0) {
                        res.status(404).json({ message: 'Document not found' });
                        return;
                    }
                    res.status(200).json({ message: 'Document updated successfully' });
                }
                else {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
            catch (error) {
                console.error('Error updating example data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // make a delete function that deletes a document in the example collection
    static deleteExample(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                let mongo = mongo_connect_1.MongoConn.getInstance();
                if (mongo.notAirBnbDB) {
                    const collection = mongo.notAirBnbDB.collection('example');
                    const result = yield collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                    if (result.deletedCount === 0) {
                        res.status(404).json({ message: 'Document not found' });
                        return;
                    }
                    res.status(200).json({ message: 'Document deleted successfully' });
                }
                else {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
            catch (error) {
                console.error('Error deleting example data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.ExampleController = ExampleController;
//# sourceMappingURL=example-controller.js.map
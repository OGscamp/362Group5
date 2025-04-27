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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const mongo_connect_1 = require("../../utilities/mongo-connect");
const mongodb_1 = require("mongodb");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../../utilities/cloudinary"));
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class PropertyController {
    static getAllProperties(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Fetching all properties...');
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                const properties = mongo.notAirBnbDB.collection('properties');
                const allProperties = yield properties.find({}).toArray();
                console.log(`Found ${allProperties.length} properties`);
                const mappedProperties = allProperties.map(property => (Object.assign(Object.assign({}, property), { photos: Array.isArray(property.photos) ? property.photos.map(photo => typeof photo === 'string' ? photo : photo.url) : [] })));
                res.json(mappedProperties);
            }
            catch (error) {
                console.error('Error fetching properties:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static getPropertyById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(`Fetching property with ID: ${id}`);
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                const properties = mongo.notAirBnbDB.collection('properties');
                const property = yield properties.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!property) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                console.log('Property found:', property);
                const mappedProperty = Object.assign(Object.assign({}, property), { photos: Array.isArray(property.photos) ? property.photos.map(photo => typeof photo === 'string' ? photo : photo.url) : [] });
                res.json(mappedProperty);
            }
            catch (error) {
                console.error('Error fetching property:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static createProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Creating new property...');
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                const { title, description, price, location, username } = req.body;
                if (!title || !description || !price || !location || !username) {
                    res.status(400).json({ error: 'Missing required fields' });
                    return;
                }
                const properties = mongo.notAirBnbDB.collection('properties');
                const newProperty = {
                    title,
                    description,
                    price: Number(price),
                    location,
                    photos: [], // Will be updated after file upload
                    userId: username, // Directly use the username from request
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                console.log('Inserting new property:', newProperty);
                const result = yield properties.insertOne(newProperty);
                // Handle file uploads if any
                if (req.files && Array.isArray(req.files)) {
                    const photoUrls = yield Promise.all(req.files.map((file) => __awaiter(this, void 0, void 0, function* () {
                        // Upload using buffer as a stream
                        const uploadResult = yield new Promise((resolve, reject) => {
                            const stream = cloudinary_1.default.uploader.upload_stream({ folder: 'not-airbnb/properties' }, (error, result) => {
                                if (error)
                                    return reject(error);
                                resolve(result);
                            });
                            stream.end(file.buffer);
                        });
                        // Type assertion for uploadResult
                        const url = uploadResult.secure_url;
                        return url;
                    })));
                    // Update property with photo URLs (array of strings)
                    yield properties.updateOne({ _id: result.insertedId }, { $set: { photos: photoUrls } });
                }
                console.log('Property created successfully:', result.insertedId);
                res.status(201).json(Object.assign(Object.assign({}, newProperty), { _id: result.insertedId, photos: newProperty.photos }));
            }
            catch (error) {
                console.error('Error creating property:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static updateProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(`Updating property with ID: ${id}`);
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const properties = mongo.notAirBnbDB.collection('properties');
                const property = yield properties.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!property) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                // Check if user is authorized to update this property
                if (property.userId !== user.username) {
                    res.status(403).json({ error: 'Not authorized to update this property' });
                    return;
                }
                const { title, description, price, location, photos } = req.body;
                const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (price && { price: Number(price) })), (location && { location })), (photos && { photos })), { updatedAt: new Date() });
                const result = yield properties.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
                if (!result) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                console.log('Property updated successfully');
                res.json(result);
            }
            catch (error) {
                console.error('Error updating property:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static deleteProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(`Deleting property with ID: ${id}`);
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const properties = mongo.notAirBnbDB.collection('properties');
                const property = yield properties.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!property) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                // Check if user is authorized to delete this property
                if (property.userId !== user.username) {
                    res.status(403).json({ error: 'Not authorized to delete this property' });
                    return;
                }
                // Delete the property
                const result = yield properties.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                if (result.deletedCount === 0) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                console.log('Property deleted successfully');
                res.status(200).json({
                    message: 'Property deleted successfully',
                    success: true
                });
            }
            catch (error) {
                console.error('Error deleting property:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static searchProperties(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Searching properties...');
                const { query, minPrice, maxPrice, location } = req.query;
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                const properties = mongo.notAirBnbDB.collection('properties');
                const searchQuery = {};
                if (query) {
                    searchQuery.$or = [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ];
                }
                if (location) {
                    searchQuery.location = { $regex: location, $options: 'i' };
                }
                if (minPrice || maxPrice) {
                    searchQuery.price = {};
                    if (minPrice)
                        searchQuery.price.$gte = Number(minPrice);
                    if (maxPrice)
                        searchQuery.price.$lte = Number(maxPrice);
                }
                const results = yield properties.find(searchQuery).toArray();
                console.log(`Found ${results.length} properties matching search criteria`);
                const mappedResults = results.map(property => (Object.assign(Object.assign({}, property), { photos: Array.isArray(property.photos) ? property.photos.map(photo => typeof photo === 'string' ? photo : photo.url) : [] })));
                res.json(mappedResults);
            }
            catch (error) {
                console.error('Error searching properties:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static updatePropertyPhotos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(`Updating photos for property with ID: ${id}`);
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const properties = mongo.notAirBnbDB.collection('properties');
                const property = yield properties.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!property) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                // Check if user is authorized to update this property
                if (property.userId !== user.username) {
                    res.status(403).json({ error: 'Not authorized to update this property' });
                    return;
                }
                const photos = req.files;
                if (!photos || photos.length === 0) {
                    res.status(400).json({ error: 'No photos provided' });
                    return;
                }
                // Upload photos to Cloudinary and get URLs
                const photoUrls = yield Promise.all(photos.map((photo) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield cloudinary_1.default.uploader.upload(photo.path, {
                        folder: 'not-airbnb/properties'
                    });
                    return {
                        url: result.secure_url,
                        publicId: result.public_id
                    };
                })));
                const result = yield properties.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
                    $set: {
                        photos: photoUrls,
                        updatedAt: new Date()
                    }
                }, { returnDocument: 'after' });
                if (!result) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                console.log('Property photos updated successfully');
                res.json(result);
            }
            catch (error) {
                console.error('Error updating property photos:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static getPropertiesByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Getting properties by user ID...');
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const properties = mongo.notAirBnbDB.collection('properties');
                const userProperties = yield properties.find({ userId: user.email }).toArray();
                // Map photos to URLs
                const mappedUserProperties = userProperties.map(property => (Object.assign(Object.assign({}, property), { photos: Array.isArray(property.photos) ? property.photos.map(photo => typeof photo === 'string' ? photo : photo.url) : [] })));
                res.json(mappedUserProperties);
            }
            catch (error) {
                console.error('Error getting user properties:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.PropertyController = PropertyController;
//# sourceMappingURL=property-controller.js.map
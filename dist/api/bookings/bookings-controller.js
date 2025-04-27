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
exports.BookingController = void 0;
const mongo_connect_1 = require("../../utilities/mongo-connect");
const mongodb_1 = require("mongodb");
class BookingController {
    // Create booking
    static createBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Creating new booking...');
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
                const { propertyId, startDate, endDate, guests } = req.body;
                if (!propertyId || !startDate || !endDate || !guests) {
                    res.status(400).json({ error: 'Missing required fields' });
                    return;
                }
                const bookings = mongo.notAirBnbDB.collection('bookings');
                const properties = mongo.notAirBnbDB.collection('properties');
                // Verify property exists
                const property = yield properties.findOne({ _id: new mongodb_1.ObjectId(propertyId) });
                if (!property) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                const newBooking = {
                    propertyId: propertyId,
                    userId: user.username,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    guests: Number(guests),
                    status: 'pending',
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                console.log('Inserting new booking:', newBooking);
                const result = yield bookings.insertOne(newBooking);
                console.log('Booking created successfully:', result.insertedId);
                res.status(201).json(Object.assign(Object.assign({}, newBooking), { _id: result.insertedId }));
            }
            catch (error) {
                console.error('Error creating booking:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Get user bookings
    static getBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Fetching bookings...');
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                const bookings = mongo.notAirBnbDB.collection('bookings');
                const properties = mongo.notAirBnbDB.collection('properties');
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                console.log('Current user:', {
                    username: user.username,
                    _id: user._id,
                    email: user.email
                });
                // Find all properties owned by this user
                const userProperties = yield properties.find({ userId: user.username }).toArray();
                console.log('User properties:', userProperties.map(p => ({
                    _id: p._id,
                    title: p.title,
                    userId: p.userId
                })));
                // Get all property IDs owned by this user
                const userPropertyIds = userProperties.map(p => p._id.toString());
                console.log('User property IDs:', userPropertyIds);
                // Find bookings where:
                // 1. User is the guest (userId matches)
                // OR
                // 2. Booking is for a property owned by this user (propertyId matches one of their properties)
                const query = {
                    $or: [
                        { userId: user.username },
                        { propertyId: { $in: userPropertyIds } }
                    ]
                };
                console.log('Query:', JSON.stringify(query, null, 2));
                const userBookings = yield bookings.find(query).toArray();
                console.log('Found bookings:', userBookings.map(b => ({
                    _id: b._id,
                    propertyId: b.propertyId,
                    userId: b.userId,
                    status: b.status
                })));
                res.json(userBookings);
            }
            catch (error) {
                console.error('Error fetching bookings:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Get booking by ID
    static getBookingById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(`Fetching booking with ID: ${id}`);
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                const bookings = mongo.notAirBnbDB.collection('bookings');
                const booking = yield bookings.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!booking) {
                    res.status(404).json({ error: 'Booking not found' });
                    return;
                }
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                // Check if user is authorized to view this booking
                if (booking.userId.toString() !== user._id.toString()) {
                    res.status(403).json({ error: 'Not authorized to view this booking' });
                    return;
                }
                console.log('Booking found:', booking);
                res.json(booking);
            }
            catch (error) {
                console.error('Error fetching booking:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Update booking status
    static updateBookingStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                if (!status) {
                    res.status(400).json({ error: 'Status is required' });
                    return;
                }
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                const bookingsCollection = mongo.notAirBnbDB.collection("bookings");
                const booking = yield bookingsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!booking) {
                    res.status(404).json({ error: 'Booking not found' });
                    return;
                }
                const propertiesCollection = mongo.notAirBnbDB.collection("properties");
                const property = yield propertiesCollection.findOne({ _id: new mongodb_1.ObjectId(booking.propertyId) });
                if (!property) {
                    res.status(404).json({ error: 'Property not found' });
                    return;
                }
                // Check if user is the property owner
                if (property.userId !== user.username) {
                    res.status(403).json({ error: 'Not authorized to update this booking' });
                    return;
                }
                // If the booking was previously accepted and is being denied, change status to rejected
                const newStatus = (booking.status === 'accepted' && status === 'denied') ? 'rejected' : status;
                const result = yield bookingsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { status: newStatus, updatedAt: new Date() } }, { returnDocument: 'after' });
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error updating booking status:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // Delete booking
    static deleteBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Get user from request (set by auth middleware)
                const user = req.user;
                if (!user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                const bookingsCollection = mongo.notAirBnbDB.collection("bookings");
                const booking = yield bookingsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!booking) {
                    res.status(404).json({ error: 'Booking not found' });
                    return;
                }
                // Check if user is authorized (either the guest or the property owner)
                const propertiesCollection = mongo.notAirBnbDB.collection("properties");
                const property = yield propertiesCollection.findOne({ _id: new mongodb_1.ObjectId(booking.propertyId) });
                if (booking.userId !== user.username && (!property || property.userId !== user.username)) {
                    res.status(403).json({ error: 'Not authorized to delete this booking' });
                    return;
                }
                // If the booking was accepted, update its status to rejected instead of deleting
                if (booking.status === 'accepted') {
                    const result = yield bookingsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { status: 'rejected', updatedAt: new Date() } }, { returnDocument: 'after' });
                    res.status(200).json(result);
                }
                else {
                    // For non-accepted bookings, proceed with deletion
                    yield bookingsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                    res.status(200).json({ message: 'Booking deleted successfully' });
                }
            }
            catch (error) {
                console.error('Error deleting booking:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static updateBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { startDate, endDate, guests, userId } = req.body;
                if (!id || !startDate || !endDate || !guests || !userId) {
                    res.status(400).json({ error: 'Missing required fields' });
                    return;
                }
                const mongo = mongo_connect_1.MongoConn.getInstance();
                yield mongo.waitForDB();
                if (!mongo.notAirBnbDB) {
                    throw new Error('Database connection not established');
                }
                const bookings = mongo.notAirBnbDB.collection('bookings');
                // Verify the booking exists and belongs to the user
                const existingBooking = yield bookings.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!existingBooking) {
                    res.status(404).json({ error: 'Booking not found' });
                    return;
                }
                if (existingBooking.userId.toString() !== userId) {
                    res.status(403).json({ error: 'Not authorized to update this booking' });
                    return;
                }
                const result = yield bookings.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                    $set: {
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        guests,
                        updatedAt: new Date()
                    }
                });
                if (result.matchedCount === 0) {
                    res.status(404).json({ error: 'Booking not found' });
                    return;
                }
                res.status(200).json({ message: 'Booking updated successfully' });
            }
            catch (error) {
                console.error('Update booking error:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.BookingController = BookingController;
//# sourceMappingURL=bookings-controller.js.map
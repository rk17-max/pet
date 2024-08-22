const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    petName: {
        type: String,
        required: true,
        trim: true
    },
    petBreed: {
        type: String,
        required: true,
        trim: true
    },
    petAge: {
        type: Number,
        required: true,
        min: 0
    },
    petLocation: {
        type: String,
        required: true,
        trim: true
    },
    petImage: {
        type: String, // Store the image URL or the path where the image is stored on the server
        
    },
    petDescription: {
        type: String,
        required: true,
        trim: true
    },
    listedAt: {
        type: Date,
        default: Date.now
    }
});

const Listing = mongoose.model('Listing',ListingSchema);

module.exports = Listing;

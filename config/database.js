const mongoose = require('mongoose');

// const MONGO_URL = "mongodb://localhost:27017/Recipe_Sharing"; // Localhost
const MONGO_URL = "mongodb+srv://harisdevcodes:NnzlJjJUXEIozSVP@muhammadharis.8qkyi.mongodb.net/";

// const mongoConnect = async (callback) => {
//     try{
//         await mongoose.connect(MONGO_URL); 
//         console.log('Connected to MongoDB with Mongoose');
//         callback();
//     }
//     catch(err){
//         console.log("MongoDB connection failded: ", err);
//     }
// }
let isConnected = false;

const mongoConnect = async (callback) => {
    if (isConnected) {
        console.log('Using existing connection');
        return callback();
    }
    try {
        await mongoose.connect(MONGO_URL);
        isConnected = true;
        console.log('Connected to MongoDB with Mongoose');
        callback();
    } catch (err) {
        console.log("MongoDB connection failed: ", err);
    }
};

exports.mongoose = mongoose;
exports.mongoConnect = mongoConnect;

// password = NnzlJjJUXEIozSVP
// username = harisdevcodes
// URL = mongodb+srv://harisdevcodes:NnzlJjJUXEIozSVP@muhammadharis.8qkyi.mongodb.net/
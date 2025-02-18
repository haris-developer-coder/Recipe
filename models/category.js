const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    created_at:{
        type: Date, 
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    },
    deleted_at:{
        type: Date,
        default: null
    }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    ingredients:{
        type: [String],
        required: true
    },
    instructions:{
        type: String,
        required:true
    },
    category:{
        type: String,
        required: true
    },
    average_rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    rating_count: {
        type: Number,
        default: 0,
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }],
    likes:{
        type: Number,
        default: 0
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
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

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
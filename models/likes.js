const mongoose = require('mongoose');

const LikesSchema = new mongoose.Schema({
    status:{
        type: Number,
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    recipe_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    deleted_at:{
        type: Date,
        default: null
    }
});

const Likes = mongoose.model('Likes', LikesSchema);

module.exports = Likes;
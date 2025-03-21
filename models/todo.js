const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    rating:{
        type: Number,
        required: true,
        min: 0,
        max: 5,
        validate: {
            validator: Number.isFinite,
            message: "Rating must be a valid number.",
        },
    },
    message:{
        type: String,
        default: null
    },
    recipe_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
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

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
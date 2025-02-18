const { mongoose } = require('../config/database');

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    profile_picture:{
        type: String,
        default: null
    },
    gender:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'user'
    },
    experience:{
        type: String,
        default: null
    },
    specialty:{
        type: String,
        default: null
    },
    certifications:{
        type: String,
        default: null
    },
    availability:{
        type: String,
        default: null
    },
    city:{
        type: String,
        default: null
    },
    state:{
        type: String,
        default: null
    },
    country:{
        type: String,
        default: null
    },
    postal_code:{
        type: String,
        default: null
    },
    social_links: {
        instagram: { type: String, default: null },
        facebook: { type: String, default: null },
        twitter: { type: String, default: null },
        website: { type: String, default: null }
    },
    recipes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    }],
    device_token:{
        type: String,
        default: null
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

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;

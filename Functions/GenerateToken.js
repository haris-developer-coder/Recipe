const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.TokenGenerate = async (userId, userRole) => {
    const secret = process.env.AUTH_SECRET;

    const token = jwt.sign({ userId, userRole }, secret, { expiresIn: '1h' });

    return token;
};